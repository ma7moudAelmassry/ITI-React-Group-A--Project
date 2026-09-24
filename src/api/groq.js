import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});


// Analyze the user's question
export async function analyzeQuestion(message) {
  const response =
    await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",

          content: `
You are a movie search assistant.

Your job is to analyze the user's message
and determine what movie information should
be retrieved from TMDB.

Return ONLY valid JSON.

Possible "type" values:

1. "search"
   The user is asking about a specific movie.

2. "discover"
   The user wants movie recommendations
   based on year, genre, or both.

3. "none"
   The question does not require movie
   database information.

For "search":
Return the movie title in "query".

Example:

User:
"Tell me about Interstellar"

Return:
{
  "type": "search",
  "query": "Interstellar"
}


For "discover":

Extract:
- year if mentioned
- genre if mentioned

Example:

User:
"Recommend action movies from 2026"

Return:
{
  "type": "discover",
  "year": 2026,
  "genre": "Action"
}


Example:

User:
"Give me some horror movies"

Return:
{
  "type": "discover",
  "year": null,
  "genre": "Horror"
}


For "none":

Example:

User:
"What does thriller mean?"

Return:

{
  "type": "none"
}

Do not include markdown.
Do not include explanations.
Return JSON only.
`,
        },

        {
          role: "user",
          content: message,
        },
      ],
    });

  const content =
    response.choices[0]?.message?.content || "{}";

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(
      "Failed to parse AI analysis:",
      content
    );

    return {
      type: "none",
    };
  }
}


// Generate the final answer
export async function generateMovieAnswer(
  userMessage,
  movies
) {
  const movieContext = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    overview: movie.overview,
    rating: movie.vote_average,
    vote_count: movie.vote_count,
    popularity: movie.popularity,
  }));

  const response =
    await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",

          content: `
You are a helpful movie assistant.

You have access to movie information
retrieved from TMDB.

Use the provided TMDB data when answering
questions about movies.

IMPORTANT RULES:

- Do not invent movies.
- Do not invent ratings.
- Do not invent release dates.
- Do not invent movie information.
- Use the provided TMDB data as your source
  for current movie information.
- If the data does not contain enough information,
  clearly say that you don't have enough information.
- You can summarize and explain the information.
- You can recommend movies from the provided list.

Format your answers using Markdown.

Use:
- headings
- bullet points
- bold text
- numbered lists

when appropriate.
`,
        },

        {
          role: "user",

          content: `
User question:

${userMessage}


TMDB movie data:

${JSON.stringify(
  movieContext,
  null,
  2
)}
`,
        },
      ],
    });

  return (
    response.choices[0]?.message?.content ||
    "Sorry, I couldn't generate an answer."
  );
}