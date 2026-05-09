import OpenAI from 'openai';
import { queryMoviePerformance, compareTitles, getMovieDetails } from '@/tools/movieTools';
import { getRegionalEngagement, getViewerDemographics, getRegionalPerformance } from '@/tools/regionalTools';
import { analyzeMarketingSpend, getChannelPerformance } from '@/tools/marketingTools';
import { searchDocuments } from '@/tools/documentTools';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export interface RateLimitInfo {
  requestsRemaining: number;
  requestsLimit: number;
  tokensRemaining: number;
  tokensLimit: number;
  resetsIn: string;
  isLimited: boolean;
}

let lastRateLimitInfo: RateLimitInfo = {
  requestsRemaining: 30,
  requestsLimit: 30,
  tokensRemaining: 12000,
  tokensLimit: 12000,
  resetsIn: '',
  isLimited: false,
};

export function getLastRateLimitInfo(): RateLimitInfo {
  return { ...lastRateLimitInfo };
}

function parseRateLimitHeaders(headers: Headers | Record<string, string>) {
  const get = (key: string) => {
    if (headers instanceof Headers) return headers.get(key) ?? '';
    return (headers as Record<string, string>)[key] ?? '';
  };
  const reqRemaining = parseInt(get('x-ratelimit-remaining-requests') || '30', 10);
  const reqLimit = parseInt(get('x-ratelimit-limit-requests') || '30', 10);
  const tokRemaining = parseInt(get('x-ratelimit-remaining-tokens') || '12000', 10);
  const tokLimit = parseInt(get('x-ratelimit-limit-tokens') || '12000', 10);
  const resetsIn = get('x-ratelimit-reset-requests') || '';
  lastRateLimitInfo = {
    requestsRemaining: isNaN(reqRemaining) ? 30 : reqRemaining,
    requestsLimit: isNaN(reqLimit) ? 30 : reqLimit,
    tokensRemaining: isNaN(tokRemaining) ? 12000 : tokRemaining,
    tokensLimit: isNaN(tokLimit) ? 12000 : tokLimit,
    resetsIn,
    isLimited: !isNaN(reqRemaining) && reqRemaining < 5,
  };
}

export interface ToolExecution {
  name: string;
  status: 'running' | 'success' | 'failed';
  duration: number;
  result?: any;
}

const toolDefinitions: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'queryMoviePerformance',
      description: 'Query movie performance data including viewers, revenue, rating, and marketing spend',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Movie title to search for' },
          genre: { type: 'string', description: 'Genre to filter by' },
          limit: { type: 'integer', description: 'Number of results to return. Must be a whole number like 5 or 10, not a string.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getMovieDetails',
      description: 'Get detailed information about a specific movie including completion rate and engagement',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Exact movie title' },
        },
        required: ['title'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'compareTitles',
      description: 'Compare performance metrics between multiple movies',
      parameters: {
        type: 'object',
        properties: {
          titles: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of movie titles to compare',
          },
          metrics: {
            type: 'array',
            items: { type: 'string' },
            description: 'Metrics to compare (revenue, viewers, rating, etc)',
          },
        },
        required: ['titles'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getRegionalEngagement',
      description: 'Get viewer engagement metrics by region',
      parameters: {
        type: 'object',
        properties: {
          region: { type: 'string', description: 'Region to filter by' },
          timeframe: { type: 'string', description: 'Time period (last 30 days, etc)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getViewerDemographics',
      description: 'Get viewer demographics by region and age group',
      parameters: {
        type: 'object',
        properties: {
          region: { type: 'string', description: 'Region to filter by' },
          ageGroup: { type: 'string', description: 'Age group (13-17, 18-24, etc)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'analyzeMarketingSpend',
      description: 'Analyze marketing spend, ROI, and conversion rates',
      parameters: {
        type: 'object',
        properties: {
          movieTitle: { type: 'string', description: 'Movie title to analyze' },
          region: { type: 'string', description: 'Region to filter by' },
          channel: { type: 'string', description: 'Marketing channel (TV, Digital, Print, Outdoor)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getChannelPerformance',
      description: 'Compare performance across different marketing channels',
      parameters: {
        type: 'object',
        properties: {
          dummy: { type: 'string', description: 'Unused' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getRegionalPerformance',
      description: 'Get marketing performance by region and channel',
      parameters: {
        type: 'object',
        properties: {
          movieId: { type: 'string', description: 'Movie ID to filter by' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'searchDocuments',
      description: 'Search uploaded PDF reports and CSV files for information. Use this for questions about internal reports, policy documents, campaign summaries, or any content from uploaded files.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query to find relevant document chunks' },
          fileType: { type: 'string', description: 'Filter by file type: "pdf" or "csv". Omit to search all.' },
          limit: { type: 'integer', description: 'Max number of results (default 5)' },
        },
        required: ['query'],
      },
    },
  },
];

async function executeTool(name: string, args: any): Promise<ToolExecution> {
  const startTime = Date.now();
  const execution: ToolExecution = { name, status: 'running', duration: 0 };

  try {
    let result;
    switch (name) {
      case 'queryMoviePerformance':
        result = await queryMoviePerformance(args);
        break;
      case 'getMovieDetails':
        result = await getMovieDetails(args.title);
        break;
      case 'compareTitles':
        result = await compareTitles(args);
        break;
      case 'getRegionalEngagement':
        result = await getRegionalEngagement(args);
        break;
      case 'getViewerDemographics':
        result = await getViewerDemographics(args);
        break;
      case 'analyzeMarketingSpend':
        result = await analyzeMarketingSpend(args);
        break;
      case 'getChannelPerformance':
        result = await getChannelPerformance();
        break;
      case 'getRegionalPerformance':
        result = await getRegionalPerformance(args.movieId);
        break;
      case 'searchDocuments':
        result = await searchDocuments(args);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    execution.status = 'success';
    execution.result = result;
  } catch (error) {
    execution.status = 'failed';
    execution.result = { error: String(error) };
    console.error(`[groq] Tool execution failed: ${name}`, error);
  }

  execution.duration = Date.now() - startTime;
  return execution;
}

export async function orchestrateTools(userMessage: string): Promise<{
  response: string;
  tools: ToolExecution[];
}> {
  const casualPatterns = /^(hi|hello|hey|thanks|thank you|ok|okay|cool|great|bye|good morning|good evening|what can you do|help)[\s!?.]*$/i;

  if (casualPatterns.test(userMessage.trim())) {
    return {
      response: "Hello! I'm your AI analytics assistant for StreamVision Entertainment. You can ask me questions like:\n• Which movies performed best this year?\n• Compare Dark Orbit vs Last Kingdom\n• Which region has the highest engagement?\n• What should leadership prioritize next quarter?\n• Why is Stellar Run trending?",
      tools: [],
    };
  }

  const toolExecutions: ToolExecution[] = [];

  try {
    console.log('[groq] Orchestrating tools for message:', userMessage);

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a data analyst assistant for StreamVision Entertainment.

CRITICAL RULES:
MANDATORY FIRST TOOL RULE:
If the user question contains ANY of these words:
'report', 'recommend', 'completion rate', 'audience', 'behavior', 'document', 'uploaded', 'policy', 'campaign', 'according to', 'what does', 'mobile-first', 'binge', 'demographics', 'engagement score', 'drop-off', 'session length'
→ Your FIRST tool call MUST be searchDocuments.
→ Calling getMovieDetails or queryMoviePerformance BEFORE searchDocuments for these questions is a VIOLATION.
→ Only call database tools AFTER searchDocuments returns results.
This rule overrides all other routing rules.

- NEVER use general knowledge or make up data. NEVER invent movie titles, revenue figures, or statistics.
- ALWAYS call tools before answering ANY data question. No exceptions.
- Only reference movies, numbers, and facts that tools actually returned to you in this conversation.
- Do NOT output raw function syntax like <function=...> in your text response.
- NEVER call a tool with a placeholder value like "a specific title". If no title is given, call queryMoviePerformance to find top titles first.

QUESTION ROUTING:
1. Strategic / leadership questions (e.g. "What should leadership do?", "What actions next quarter?")
   → Call queryMoviePerformance, getChannelPerformance, and analyzeMarketingSpend.
   → Synthesize high-level executive recommendations from those results only.

2. Specific movie questions (e.g. "How did Stellar Run perform?")
   → Call getMovieDetails or queryMoviePerformance with the title.

3. Comparison questions (e.g. "Compare Dark Orbit vs Last Kingdom")
   → Call compareTitles with the list of titles.

4. Audience / demographic / segment / engagement questions (e.g. "most engaged segments", "which age group watches most")
   → Call BOTH getViewerDemographics AND getRegionalEngagement.
   → Describe the subscription breakdown, avg watch time, and top regions using the returned numbers.

5. Marketing questions
   → Call analyzeMarketingSpend or getChannelPerformance.

6. Ranking / trend / performance questions (e.g. "Top movies", "Best performers", "Why is a title trending")
   → Call queryMoviePerformance to get top titles.
   → Use the returned ratings, viewers, and revenue to explain. Do not guess reasons.

7. Questions about reports, documents, policies, campaigns, roadmaps, or uploaded files
   → Call searchDocuments first. If database tools are also relevant, call both.

SOURCE ATTRIBUTION RULE:
- Database tools → "Based on database records, ..."
- searchDocuments → "Based on the uploaded [filename], ..."
- Both → "Combining database records and uploaded documents, ..."

After receiving tool results, answer in 3-5 clear sentences using ONLY the returned data. No invented examples. No follow-up prompts.`,
      },
      { role: 'user', content: userMessage },
    ];

    const pickModel = async (msgs: OpenAI.ChatCompletionMessageParam[]) => {
      for (const model of [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
        'gemma2-9b-it',
      ]) {
        try {
          const res = await groq.chat.completions.create({
            model,
            messages: msgs,
            tools: toolDefinitions,
            tool_choice: 'auto',
            max_tokens: 2000,
          });
          // Capture rate limit headers from successful response
          if ((res as any)._request_id) {
            try {
              const rawHeaders = (res as any).__headers ?? (res as any)._headers;
              if (rawHeaders) parseRateLimitHeaders(rawHeaders);
            } catch { /* headers not accessible — ignore */ }
          }
          console.log(`[groq] Using model: ${model}`);
          return res;
        } catch (err: any) {
          if (err?.status === 400 && err?.code === 'tool_use_failed') {
            console.warn(`[groq] Model ${model} produced invalid tool call, skipping`);
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          if (err?.code === 'model_decommissioned' || err?.code === 'rate_limit_exceeded') {
            // Extract reset time from headers/message for rate limit
            if (err?.code === 'rate_limit_exceeded') {
              if (err?.headers) {
                try { parseRateLimitHeaders(err.headers); } catch { /* ignore */ }
              }
              const match = String(err?.message ?? '').match(/try again in ([^\s.]+)/i);
              if (match) lastRateLimitInfo = { ...lastRateLimitInfo, resetsIn: match[1], isLimited: true };
            }
            console.warn(`[groq] Model ${model} unavailable, trying fallback...`);
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          throw err;
        }
      }
      throw new Error('RATE_LIMIT_EXCEEDED: All models rate-limited. Try again in 30 seconds.');
    };

    let response = await pickModel(messages);

    console.log('[groq] Initial response. finish_reason:', response.choices[0].finish_reason);

    // Agentic loop (max 5 iterations to prevent runaway loops)
    let iterations = 0;
    while (response.choices[0].message.tool_calls?.length && iterations < 5) {
      iterations++;
      const allToolCalls = response.choices[0].message.tool_calls;
      const toolCalls = allToolCalls.filter(
        (tc): tc is OpenAI.ChatCompletionMessageFunctionToolCall => tc.type === 'function'
      );

      console.log(`[groq] Tool calls (${toolCalls.length}):`, toolCalls.map((tc) => tc.function.name));

      // Add assistant message with tool calls to history
      messages.push({
        role: 'assistant',
        content: response.choices[0].message.content || '',
        tool_calls: allToolCalls,
      });

      // Execute all tools in parallel
      const toolResults = await Promise.all(
        toolCalls.map(async (toolCall) => {
          const rawArgs = JSON.parse(toolCall.function.arguments || '{}');
          const args = {
            ...rawArgs,
            ...(rawArgs.limit !== undefined && { limit: parseInt(String(rawArgs.limit), 10) }),
            ...(rawArgs.title === '' && { title: undefined }),
            ...(rawArgs.genre === '' && { genre: undefined }),
            ...(rawArgs.region === '' && { region: undefined }),
            ...(rawArgs.ageGroup === '' && { ageGroup: undefined }),
          };
          console.log(`[groq] Executing: ${toolCall.function.name}`, args);
          const execution = await executeTool(toolCall.function.name, args);
          console.log(`[groq] Done: ${toolCall.function.name} | status: ${execution.status} | ${execution.duration}ms`);
          toolExecutions.push(execution);
          return {
            tool_call_id: toolCall.id,
            content: JSON.stringify(execution.result ?? {}),
          };
        })
      );

      // Add all tool results to history
      for (const result of toolResults) {
        messages.push({
          role: 'tool',
          tool_call_id: result.tool_call_id,
          content: result.content,
        });
      }

      // Follow-up call — let model decide if more tools needed
      response = await pickModel(messages);
      console.log('[groq] Follow-up response. finish_reason:', response.choices[0].finish_reason);
    }

    // Clean any leaked <function=...> tags from final text
    const raw = response.choices[0].message.content || 'Unable to generate response';
    const finalResponse = raw
      .replace(/<function=[^>]*>[\s\S]*?<\/function>/g, '')
      .replace(/<function=[^/]*\/>/g, '')
      .trim();

    return { response: finalResponse, tools: toolExecutions };
  } catch (error) {
    console.error('[groq] Tool orchestration error:', error);
    throw error;
  }
}