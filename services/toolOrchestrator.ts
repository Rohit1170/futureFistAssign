import OpenAI from 'openai';
import { queryMoviePerformance, compareTitles, getMovieDetails } from '@/tools/movieTools';
import { getRegionalEngagement, getViewerDemographics, getRegionalPerformance } from '@/tools/regionalTools';
import { analyzeMarketingSpend, getChannelPerformance } from '@/tools/marketingTools';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

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
          limit: { type: 'integer', description: 'Number of results to return' },
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
];

async function executeTool(name: string, args: any): Promise<ToolExecution> {
  const startTime = Date.now();
  const execution: ToolExecution = {
    name,
    status: 'running',
    duration: 0,
  };

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
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    execution.status = 'success';
    execution.result = result;
  } catch (error) {
    execution.status = 'failed';
    execution.result = { error: String(error) };
    console.error(`[v0] Tool execution failed: ${name}`, error);
  }

  execution.duration = Date.now() - startTime;
  return execution;
}

export async function orchestrateTools(userMessage: string): Promise<{
  response: string;
  tools: ToolExecution[];
}> {
  const tools: ToolExecution[] = [];

  try {
    console.log('[v0] Orchestrating tools for message:', userMessage);

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: 'You are a helpful data analyst assistant. When you need data, call the appropriate tool using the tools provided. Always use tool calls in valid JSON format.',
      },
      { role: 'user', content: userMessage },
    ];

    let response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      tools: toolDefinitions,
      tool_choice: 'auto',
      max_tokens: 2000,
    });

    console.log('[v0] Initial response:', response.choices[0].message);

    while (response.choices[0].message.tool_calls) {
      const toolCalls = response.choices[0].message.tool_calls;

      messages.push({
        role: 'assistant',
        content: response.choices[0].message.content || '',
        tool_calls: toolCalls,
      });

      const toolResults = await Promise.all(
        toolCalls.map(async (toolCall) => {
          const execution = await executeTool(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          );
          tools.push(execution);
          return {
            tool_call_id: toolCall.id,
            result: JSON.stringify(execution.result),
          };
        })
      );

      for (const result of toolResults) {
        messages.push({
          role: 'tool',
          tool_call_id: result.tool_call_id,
          content: result.result,
        });
      }

      response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages,
        tools: toolDefinitions,
        tool_choice: 'auto',
        max_tokens: 2000,
      });

      console.log('[v0] Follow-up response:', response.choices[0].message);
    }

    const finalResponse = response.choices[0].message.content || 'Unable to generate response';

    return { response: finalResponse, tools };
  } catch (error) {
    console.error('[v0] Tool orchestration error:', error);
    throw error;
  }
}
