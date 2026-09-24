
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  fetchSearchMovies,
  discoverMovies,
  fetchSearchTv,
  discoverTv,
} from "../../api/tmdb";
import { analyzeQuestion, generateMovieAnswer } from "../../api/groq";
import "./Chatbot.css";

// TMDB genre IDs (movies)
const movieGenreIds = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  horror: 27,
  mystery: 9648,
  romance: 10749,
  "science fiction": 878,
  "sci-fi": 878,
  thriller: 53,
  war: 10752,
};

// TMDB genre IDs (TV) - different from movies
const tvGenreIds = {
  action: 10759,
  adventure: 10759,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  kids: 10762,
  mystery: 9648,
  reality: 10764,
  fantasy: 10765,
  "science fiction": 10765,
  "sci-fi": 10765,
  war: 10768,
  western: 37,
  horror: 9648,
  thriller: 9648,
  romance: 18,
};

function Chatbot() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are a helpful movie assistant.",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get movies or TV shows from TMDB
  async function retrieveMedia(message, conversation) {
    const analysis = await analyzeQuestion(message, conversation);

    console.log("Question analysis:", analysis);

    const mediaType = analysis.mediaType === "tv" ? "tv" : "movie";

    // The question doesn't need TMDB
    if (analysis.type === "none") {
      return { items: [], mediaType };
    }

    // User is asking about a specific title
    if (analysis.type === "search") {
      if (!analysis.query) {
        return { items: [], mediaType };
      }

      const data =
        mediaType === "tv"
          ? await fetchSearchTv(analysis.query)
          : await fetchSearchMovies(analysis.query);

      return { items: data.results?.slice(0, 8) || [], mediaType };
    }

    // User wants recommendations
    if (analysis.type === "discover") {
      const year = analysis.year || undefined;

      const genreMap = mediaType === "tv" ? tvGenreIds : movieGenreIds;

      const genreId = analysis.genre
        ? genreMap[analysis.genre.toLowerCase()]
        : undefined;

      const data =
        mediaType === "tv"
          ? await discoverTv({ year, genreId })
          : await discoverMovies({ year, genreId });

      return { items: data.results?.slice(0, 8) || [], mediaType };
    }

    return { items: [], mediaType };
  }

  async function sendMessage(e) {
    e.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    const userMessage = {
      role: "user",
      content: prompt,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);

    const currentPrompt = prompt;

    setPrompt("");

    setIsLoading(true);

    try {
      // STEP 1: Retrieve movies / TV shows from TMDB
      const previousConversation = messages.filter(
        (message) => message.role !== "system",
      );

      const { items, mediaType } = await retrieveMedia(
        currentPrompt,
        previousConversation,
      );

      console.log("Retrieved from TMDB:", mediaType, items);

      // STEP 2: Generate final answer using Groq
      const answer = await generateMovieAnswer(
        currentPrompt,
        items,
        mediaType,
        previousConversation,
      );

      const aiMessage = {
        role: "assistant",
        content: answer,
      };

      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);

      const errorMessage = {
        role: "assistant",
        content: "Sorry, something went wrong while getting movie information.",
      };

      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Open chatbot button */}

      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
              <path d="M352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 128L192 128C139 128 96 171 96 224L96 448C96 501 139 544 192 544L448 544C501 544 544 501 544 448L544 224C544 171 501 128 448 128L352 128L352 64zM160 432C160 418.7 170.7 408 184 408L216 408C229.3 408 240 418.7 240 432C240 445.3 229.3 456 216 456L184 456C170.7 456 160 445.3 160 432zM280 432C280 418.7 290.7 408 304 408L336 408C349.3 408 360 418.7 360 432C360 445.3 349.3 456 336 456L304 456C290.7 456 280 445.3 280 432zM400 432C400 418.7 410.7 408 424 408L456 408C469.3 408 480 418.7 480 432C480 445.3 469.3 456 456 456L424 456C410.7 456 400 445.3 400 432zM224 240C250.5 240 272 261.5 272 288C272 314.5 250.5 336 224 336C197.5 336 176 314.5 176 288C176 261.5 197.5 240 224 240zM368 288C368 261.5 389.5 240 416 240C442.5 240 464 261.5 464 288C464 314.5 442.5 336 416 336C389.5 336 368 314.5 368 288zM64 288C64 270.3 49.7 256 32 256C14.3 256 0 270.3 0 288L0 384C0 401.7 14.3 416 32 416C49.7 416 64 401.7 64 384L64 288zM608 256C590.3 256 576 270.3 576 288L576 384C576 401.7 590.3 416 608 416C625.7 416 640 401.7 640 384L640 288C640 270.3 625.7 256 608 256z" />
            </svg>
          </span>
        </button>
      )}

      {/* Chat window */}

      {isOpen && (
        <div className="chat-window">
          {/* Header */}

          <div className="chat-header">
            <span>FilmkAI</span>

            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* Messages */}

          <div className="chat-messages">
            {messages
              .filter((message) => message.role !== "system")

              .map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.role === "user" ? "user-message" : "ai-message"
                  }`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ))}

            {/* Loading message */}

            {isLoading && <div className="message ai-message">Thinking...</div>}
          </div>

          {/* Input */}

          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about movies..."
              disabled={isLoading}
            />

            <button type="submit" disabled={isLoading}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}


export default Chatbot;