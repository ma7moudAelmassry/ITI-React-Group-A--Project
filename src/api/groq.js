import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Analyze the user's question
export async function analyzeQuestion(message, conversation = []) {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",

        content: `
You are a movie and TV show search assistant.

Your job is to analyze the user's message
and determine what information should
be retrieved from TMDB.

The messages after these instructions are the complete conversation history.
Use that history to understand follow-up questions and pronouns. For example,
if the user says "tell me more about it" or "recommend something similar",
resolve "it" and "similar" using the most recent relevant movie or TV show
mentioned in the conversation. Return the actual title in "query" when a
follow-up refers to a specific title.

Return ONLY valid JSON.

Fields:

"mediaType":
- "movie" if the user is asking about movies / films
- "tv" if the user is asking about TV shows, series,
  seasons, episodes, or anime series
- If it's unclear, use "movie"

"type":
1. "search"   -> the user is asking about a specific title
2. "discover" -> the user wants recommendations based on
                 year, genre, or both
3. "none"     -> the question does not require database info

For "search":
Return the title in "query".

Example:
User: "Tell me about Interstellar"
Return:
{ "type": "search", "mediaType": "movie", "query": "Interstellar" }

Example:
User: "What is Breaking Bad about?"
Return:
{ "type": "search", "mediaType": "tv", "query": "Breaking Bad" }

For "discover":
Extract year and genre if mentioned.

Example:
User: "Recommend action movies from 2026"
Return:
{ "type": "discover", "mediaType": "movie", "year": 2026, "genre": "Action" }

Example:
User: "Suggest some comedy series"
Return:
{ "type": "discover", "mediaType": "tv", "year": null, "genre": "Comedy" }

For "none":
Example:
User: "What does thriller mean?"
Return:
{ "type": "none", "mediaType": "movie" }

Do not include markdown.
Do not include explanations.
Return JSON only.
`,
      },

      ...conversation,
      {
        role: "user",
        content: message,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "{}";

  try {
    // Remove code fences in case the model adds them
    const cleaned = content.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse AI analysis:", content);

    return {
      type: "none",
      mediaType: "movie",
    };
  }
}

// Generate the final answer
export async function generateMovieAnswer(
  userMessage,
  items,
  mediaType = "movie",
  conversation = [],
) {
  // Movies use title/release_date, TV shows use name/first_air_date
  const context = items.map((item) => ({
    id: item.id,
    title: item.title || item.name,
    release_date: item.release_date || item.first_air_date,
    overview: item.overview,
    rating: item.vote_average,
    vote_count: item.vote_count,
    popularity: item.popularity,
  }));

  const label = mediaType === "tv" ? "TV show" : "movie";

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",

        content: `
You are a helpful movie and TV show assistant.

You have access to ${label} information
retrieved from TMDB.

The messages after these instructions contain the complete conversation
history. The latest user question is a follow-up to that history, not an
isolated question. Read the previous user and assistant messages before
answering. Resolve words such as "it", "this movie", "that show", "the
second one", and "similar" from the most recent relevant context. If the
question depends on an earlier title, mention that title in your answer.

Use the provided TMDB data when answering
questions about movies and TV shows.

IMPORTANT RULES:

- Do not invent movies or TV shows.
- Do not invent ratings.
- Do not invent release dates.
- Do not invent any information.
- Use the provided TMDB data as your source
  for current information.
- If the data does not contain enough information,
  clearly say that you don't have enough information.
- You can summarize and explain the information.
- You can recommend titles from the provided list.
- For TV shows, "release_date" is the first air date.

Format your answers using Markdown.

Use:
- headings
- bullet points
- bold text
- numbered lists

when appropriate.
`,
      },

      ...conversation,
      {
        role: "user",
        content: `
User question:

${userMessage}


TMDB ${label} data:

${JSON.stringify(context, null, 2)}
`,
      },
    ],
  });

  return (
    response.choices[0]?.message?.content ||
    "Sorry, I couldn't generate an answer."
  );
}