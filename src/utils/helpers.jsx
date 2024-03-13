import OpenAI from 'openai';
import { env } from "../env.js";

const openai = new OpenAI({ apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true});  // TODO: edit later

// Let's generalize the prompt and call the search types (1) and (2) in case the LLM is sensitive to the names. We can replace them with different names programmatically to see what works best.
const SEARCH_TYPE_EXPLANATION = `- (1) search is usually preferred when the query is a broad topic or semantically complex because it lets us retrieve high quality, semantically relevant data. (1) search is especially suitable when a topic is well-known and popularly discussed on the Internet, allowing the machine learning model to retrieve contents which are more likely recommended by real humans.  
- (2) search is useful when the topic is specific, local or obscure. If the query is a specific person's name, and identifier, or acronym, such that relevant results will contain the query itself, (2) search may do well. And if the machine learning model doesn't know about the topic, but relevant documents can be found by directly matching the search query, (2) search may be necessary.
`;

async function getLLMResponse({system = 'You are a helpful assistant.', user = '', temperature = 1, model = 'gpt-3.5-turbo'}){
    const completion = await openai.chat.completions.create({
        model,
        temperature,
        messages: [
            {'role': 'system', 'content': system},
            {'role': 'user', 'content': user},
        ]
    });
    return completion.choices[0].message.content;
}

// LLM chooses between search types and returns best type
export async function decideSearchType(topic, choiceNames = ['neural', 'keyword']){
    let userMessage = 'Decide whether to use (1) or (2) search for the provided research topic. Output your choice in a single word: either "(1)" or "(2)". Here is a guide that will help you choose:\n';
    userMessage += SEARCH_TYPE_EXPLANATION;
    userMessage += `Topic: ${topic}\n`;
    userMessage += `Search type: `;
    userMessage = userMessage.replaceAll('(1)', choiceNames[0]).replaceAll('(2)', choiceNames[1]);

    const response = await getLLMResponse({
        system: 'You will be asked to make a choice between two options. Answer with your choice in a single word.',
        user: userMessage,
        temperature: 0
    });
    const useKeyword = response.trim().toLowerCase().startsWith(choiceNames[1].toLowerCase());
    return useKeyword ? 'keyword' : 'neural';
}
