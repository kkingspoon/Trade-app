
import { GoogleGenAI } from "@google/genai";
import { Bot, BotStrategy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getGlobalInsights(): Promise<string> {
  const prompt = `
    Act as a lead quantitative researcher for a high-end algorithmic crypto fund. 
    Summarize the current (simulated) global crypto market conditions in 2-3 impact-driven sentences.
    Focus on volatility levels, trend direction (bull/bear/sideways), and institutional sentiment cues.
    Style: Sharp, professional, sophisticated. Avoid clichés.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "Awaiting signal synchronization...";
  } catch (error) {
    return "Market intelligence offline. Retrying link...";
  }
}

export async function getTradingAnalysis(pair: string, strategy: BotStrategy): Promise<string> {
  const prompt = `
    Conduct a deep-dive algorithmic analysis for the ${pair} pair.
    The current active protocol is ${strategy}.
    
    1. Assess the effectiveness of ${strategy} in the current volatility regime.
    2. Provide a specific performance prediction or risk warning.
    3. Final verdict: [OPTIMIZE / MAINTAIN / HALT] with a 1-sentence logic.

    Keep it highly technical and brief.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Quant sync failed.";
  } catch (error) {
    return "Error: AI pipeline disrupted.";
  }
}

export async function getAgentResponse(bot: Bot, query: string): Promise<string> {
    const prompt = `
      You are the Neural Interface Agent for a quantitative trading bot.
      Bot Data: ${bot.name} | Strategy: ${bot.strategy} | PNL: ${bot.pnl.toFixed(2)} USDT.
      
      The user asked: "${query}"

      Respond as a professional quant assistant. Be brief, use technical terms where appropriate, and provide data-driven logic for any advice.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Agent offline.";
    } catch (error) {
        return "Neural link failed.";
    }
}

export async function getPatternAnalysis(asset: string): Promise<{ analysis: string; sources: any[] }> {
    const prompt = `
        Act as an expert technical analyst AI. Use Google Search to find the latest technical analysis and chart patterns for the asset: ${asset}.
        Identify one dominant, recent pattern (e.g., Bullish Flag, Head and Shoulders, etc.) from the search results.
        
        Provide a concise analysis including:
        1. The name of the pattern and the timeframe.
        2. A brief explanation of what it signifies.
        3. Key price levels to watch (support, resistance, or breakout targets).
        4. A concluding sentence on the potential market implication.
        
        Format the output as: PatternName|Timeframe|Full analysis description.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        return {
            analysis: response.text || `Error|Unknown Timeframe|Could not retrieve real-time analysis for ${asset}.`,
            sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
        };
    } catch (error) {
        console.error("Pattern analysis failed:", error);
        return {
            analysis: `Error|Unknown Timeframe|Pattern analysis module offline for ${asset}.`,
            sources: []
        };
    }
}

export async function getBacktestingAnalysis(pair: string, timeframe: string, components: string[]): Promise<string> {
    const prompt = `
        Act as a Quantitative Analysis Engine. You are running a historical backtest for a trading strategy on the ${pair} pair over the ${timeframe} timeframe.
        The strategy is composed of the following signals: ${components.join(', ')}.

        Based on these components, generate a realistic but fictional backtest result.
        
        Provide the output in the following format, separated by '|':
        Net Profit (e.g., 15230.45) | Total Return % (e.g., 76.15) | Win Rate % (e.g., 62.5) | Max Drawdown % (e.g., -15.2) | Total Trades (e.g., 142) | A 2-3 sentence summary of the strategy's performance, strengths, and weaknesses.

        Example output:
        15230.45|76.15|62.5|-15.2|142|The strategy performed well in trending markets, capturing significant upside. However, it was susceptible to choppy, sideways conditions, leading to a higher number of small losses.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "7845.12|39.23|58.1|-22.5|188|Backtesting engine offline. Defaulting to baseline metrics. Strategy shows moderate profitability but suffers from significant drawdown during volatile periods. Recommend tightening stop-loss parameters.";
    } catch (error) {
        return `7845.12|39.23|58.1|-22.5|188|Backtesting engine offline. Defaulting to baseline metrics. Strategy shows moderate profitability but suffers from significant drawdown during volatile periods. Recommend tightening stop-loss parameters.`;
    }
}
