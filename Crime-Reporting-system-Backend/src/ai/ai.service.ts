// // src/modules/ai/ai.service.ts
// import { PrismaClient } from "@prisma/client";
// import { OpenAIEmbeddings } from "@langchain/openai"; // Keep OpenAI embeddings (best quality)
// import { PineconeStore } from "@langchain/pinecone";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { ChatGroq } from "@langchain/groq"; // Use Groq LLM (free, fast)
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
// import { PromptTemplate } from "@langchain/core/prompts";

// const prisma = new PrismaClient();

// // Use OpenAI embeddings (best quality) — still needs OpenAI key
// const embeddings = new OpenAIEmbeddings({
//   openAIApiKey: process.env.OPENAI_API_KEY!,
//   model: "text-embedding-3-small", // Cheaper and good
// });

// // Use Groq for LLM (free, fast, unlimited)
// const llm = new ChatGroq({
//   apiKey: process.env.GROQ_API_KEY!,
//   model: "llama-3.1-70b-versatile", // Excellent model
//   temperature: 0.3,
// });

// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY!,
// });

// const index = pinecone.Index(process.env.PINECONE_INDEX!);

// const publicStore = new PineconeStore(embeddings, {
//   pineconeIndex: index,
//   namespace: "public-notices",
// });

// const privateStore = new PineconeStore(embeddings, {
//   pineconeIndex: index,
//   namespace: "private-data",
// });

// const publicRetriever = publicStore.asRetriever({ k: 6 });
// const privateRetriever = privateStore.asRetriever({ k: 10 });

// // Public chain
// const publicChain = RunnableSequence.from([
//   {
//     context: publicRetriever.pipe((docs) =>
//       docs.map((d) => d.pageContent).join("\n\n")
//     ),
//     question: new RunnablePassthrough(),
//   },
//   PromptTemplate.fromTemplate(
//     `You are a helpful assistant for the Adama City Police public portal. Answer politely and concisely using only the provided safety notices.

// Context:
// {context}

// Question: {question}

// Answer:`
//   ),
//   llm,
//   new StringOutputParser(),
// ]);

// // Private chain
// const privateChain = RunnableSequence.from([
//   {
//     context: privateRetriever.pipe((docs) =>
//       docs.map((d) => d.pageContent).join("\n\n")
//     ),
//     question: new RunnablePassthrough(),
//   },
//   PromptTemplate.fromTemplate(
//     `You are an AI analyst for the Adama City Police admin dashboard.

// For SUPER_ADMIN/ADMIN: Provide deep insights, statistics, and trends.
// For OFFICER: Provide relevant case summaries only.

// Context:
// {context}

// Question: {question}

// Answer:`
//   ),
//   llm,
//   new StringOutputParser(),
// ]);

// export async function queryAI(query: string, role?: string) {
//   if (!role || role === "PUBLIC") {
//     const result = await publicChain.invoke(query);
//     return { response: result, source: "public" };
//   }

//   if (["SUPER_ADMIN", "ADMIN"].includes(role)) {
//     const result = await privateChain.invoke(query);
//     return { response: result, source: "private-admin" };
//   }

//   if (role === "OFFICER") {
//     const officerRetriever = privateStore.asRetriever({ k: 5 });
//     const officerChain = RunnableSequence.from([
//       {
//         context: officerRetriever.pipe((docs) =>
//           docs.map((d) => d.pageContent).join("\n\n")
//         ),
//         question: new RunnablePassthrough(),
//       },
//       PromptTemplate.fromTemplate(
//         `You are an AI assistant for police officers. Provide relevant case summaries only.

// Context:
// {context}

// Question: {question}

// Answer:`
//       ),
//       llm,
//       new StringOutputParser(),
//     ]);
//     const result = await officerChain.invoke(query);
//     return { response: result, source: "private-officer" };
//   }

//   return { response: "Access denied.", source: "none" };
// }

// // Indexing functions (unchanged)
// export async function indexPublicData() {
//   console.log("Indexing public notices...");
//   const notices = await prisma.notice.findMany({
//     where: { isPublished: true },
//   });

//   const docs = notices.map((n) => ({
//     pageContent: `${n.title}\n${n.content}\n${n.description || ""}`,
//     metadata: { id: n.id, type: "notice" },
//   }));

//   if (docs.length > 0) {
//     await publicStore.addDocuments(docs);
//     console.log(`Indexed ${docs.length} public notices`);
//   } else {
//     console.log("No published notices to index");
//   }
// }

// export async function indexPrivateData() {
//   console.log("Indexing private data...");
//   const reports = await prisma.report.findMany();
//   const contacts = (prisma as any).contact ? await (prisma as any).contact.findMany() : [];

//   const reportDocs = reports.map((r) => ({
//     pageContent: `Report: ${r.title}\n${r.description}\nStatus: ${r.status}\nLocation: ${r.locationId}`,
//     metadata: { id: r.id, type: "report" },
//   }));

//   const contactDocs = contacts.map((c: { subject: any; message: any; firstName: any; lastName: any; email: any; id: any; }) => ({
//     pageContent: `Contact: ${c.subject}\n${c.message}\nFrom: ${c.firstName} ${c.lastName} (${c.email})`,
//     metadata: { id: c.id, type: "contact" },
//   }));

//   const allDocs = [...reportDocs, ...contactDocs];

//   if (allDocs.length > 0) {
//     await privateStore.addDocuments(allDocs);
//     console.log(`Indexed ${allDocs.length} private documents`);
//   } else {
//     console.log("No private data to index");
//   }
// }

// npx ts - node scripts / index - rag.ts


// src/modules/ai/ai.service.ts


// import { PrismaClient } from "@prisma/client";
// import { CohereEmbeddings } from "@langchain/cohere"; // ← Cohere embeddings (free trial)
// import { PineconeStore } from "@langchain/pinecone";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { ChatGroq } from "@langchain/groq"; // ← Groq LLM (free)
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
// import { PromptTemplate } from "@langchain/core/prompts";

// const prisma = new PrismaClient();

// // Cohere embeddings — free trial, high quality, no quota issue for indexing
// const embeddings = new CohereEmbeddings({
//   apiKey: process.env.COHERE_API_KEY!,
//   model: "embed-english-v3.0",
// });

// // Groq LLM — completely free
// const llm = new ChatGroq({
//   apiKey: process.env.GROQ_API_KEY!,
//   model: "llama-3.1-70b-versatile",
//   temperature: 0.3,
// });

// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY!,
// });

// const index = pinecone.Index(process.env.PINECONE_INDEX!);

// const publicStore = new PineconeStore(embeddings, {
//   pineconeIndex: index,
//   namespace: "public-notices",
// });

// const privateStore = new PineconeStore(embeddings, {
//   pineconeIndex: index,
//   namespace: "private-data",
// });

// const publicRetriever = publicStore.asRetriever({ k: 6 });
// const privateRetriever = privateStore.asRetriever({ k: 10 });

// const publicChain = RunnableSequence.from([
//   {
//     context: publicRetriever.pipe((docs) =>
//       docs.map((d) => d.pageContent).join("\n\n")
//     ),
//     question: new RunnablePassthrough(),
//   },
//   PromptTemplate.fromTemplate(
//     `You are a helpful assistant for the Adama City Police public portal. Answer politely and concisely using only the provided safety notices.

// Context:
// {context}

// Question: {question}

// Answer:`
//   ),
//   llm,
//   new StringOutputParser(),
// ]);

// const privateChain = RunnableSequence.from([
//   {
//     context: privateRetriever.pipe((docs) =>
//       docs.map((d) => d.pageContent).join("\n\n")
//     ),
//     question: new RunnablePassthrough(),
//   },
//   PromptTemplate.fromTemplate(
//     `You are an AI analyst for the Adama City Police admin dashboard.

// For SUPER_ADMIN/ADMIN: Provide deep insights, statistics, trends.
// For OFFICER: Provide relevant case summaries only.

// Context:
// {context}

// Question: {question}

// Answer:`
//   ),
//   llm,
//   new StringOutputParser(),
// ]);

// export async function queryAI(query: string, role?: string) {
//   if (!role || role === "PUBLIC") {
//     const result = await publicChain.invoke(query);
//     return { response: result, source: "public" };
//   }

//   if (["SUPER_ADMIN", "ADMIN"].includes(role)) {
//     const result = await privateChain.invoke(query);
//     return { response: result, source: "private-admin" };
//   }

//   if (role === "OFFICER") {
//     const officerRetriever = privateStore.asRetriever({ k: 5 });
//     const officerChain = RunnableSequence.from([
//       {
//         context: officerRetriever.pipe((docs) =>
//           docs.map((d) => d.pageContent).join("\n\n")
//         ),
//         question: new RunnablePassthrough(),
//       },
//       PromptTemplate.fromTemplate(
//         `You are an AI assistant for police officers. Provide relevant case summaries only.

// Context:
// {context}

// Question: {question}

// Answer:`
//       ),
//       llm,
//       new StringOutputParser(),
//     ]);
//     const result = await officerChain.invoke(query);
//     return { response: result, source: "private-officer" };
//   }

//   return { response: "Access denied.", source: "none" };
// }

// // Indexing functions — now use Cohere embeddings (no OpenAI quota error)
// export async function indexPublicData() {
//   console.log("Indexing public notices...");
//   const notices = await prisma.notice.findMany({
//     where: { isPublished: true },
//   });

//   const docs = notices.map((n) => ({
//     pageContent: `${n.title}\n${n.content}\n${n.description || ""}`,
//     metadata: { id: n.id, type: "notice" },
//   }));

//   if (docs.length > 0) {
//     await publicStore.addDocuments(docs);
//     console.log(`Indexed ${docs.length} public notices`);
//   } else {
//     console.log("No published notices to index");
//   }
// }

// export async function indexPrivateData() {
//   console.log("Indexing private data...");
//   const reports = await prisma.report.findMany();
//   const contacts = (prisma as any).contact ? await (prisma as any).contact.findMany() : [];

//   const reportDocs = reports.map((r) => ({
//     pageContent: `Report: ${r.title}\n${r.description}\nStatus: ${r.status}\nLocation: ${r.locationId || "Unknown"}`,
//     metadata: { id: r.id, type: "report" },
//   }));

//   const contactDocs = contacts.map((c: { subject: any; message: any; firstName: any; lastName: any; email: any; id: any; }) => ({
//     pageContent: `Contact: ${c.subject}\n${c.message}\nFrom: ${c.firstName} ${c.lastName} (${c.email})`,
//     metadata: { id: c.id, type: "contact" },
//   }));

//   const allDocs = [...reportDocs, ...contactDocs];

//   if (allDocs.length > 0) {
//     await privateStore.addDocuments(allDocs);
//     console.log(`Indexed ${allDocs.length} private documents`);
//   } else {
//     console.log("No private data to index");
//   }
// }

// src/modules/ai/ai.service.ts
import { PrismaClient } from "@prisma/client";
import { CohereEmbeddings } from "@langchain/cohere";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";

const prisma = new PrismaClient();

const embeddings = new CohereEmbeddings({
  apiKey: process.env.COHERE_API_KEY!,
  model: "embed-english-v3.0",
});

// const llm = new ChatGroq({
//   apiKey: process.env.GROQ_API_KEY!,
//   model: "mixtral-8x7b-32768", // ← This one ALWAYS works
//   temperature: 0.3,
// });
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  // CHANGED: Using the latest stable Llama model on Groq
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
});
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX!);

const publicStore = new PineconeStore(embeddings, {
  pineconeIndex: index,
  namespace: "public-notices",
});

// const privateStore = new PineconeStore(embeddings, {
//   pineconeIndex: index,
//   namespace: "private-data",
// });
const privateStore = new PineconeStore(embeddings, {
  pineconeIndex: index,
  namespace: "private-data", // Ensure this matches indexPrivateData()
})
const publicRetriever = publicStore.asRetriever({ k: 6 });
const privateRetriever = privateStore.asRetriever({ k: 10 });

// const publicChain = RunnableSequence.from([
//   {
//     context: publicRetriever.pipe((docs) =>
//       docs.map((d) => d.pageContent).join("\n\n")
//     ),
//     question: new RunnablePassthrough(),
//   },
//   PromptTemplate.fromTemplate(
//     `You are a helpful assistant for the Adama City Police public portal. Answer politely and concisely using only the provided safety notices.

// Context:
// {context}

// Question: {question}

// Answer:`
//   ),
//   llm,
//   new StringOutputParser(),
// ]);


const publicChain = RunnableSequence.from([
  {
    context: async (question: string) => {
      console.log("AI is searching for:", question);

      // We manually call the retriever to see if it finds anything
      const docs = await publicRetriever._getRelevantDocuments(question);

      console.log(`Found ${docs.length} relevant documents`);

      if (docs.length === 0) {
        return "No specific notices found.";
      }

      const contextText = docs.map((d) => d.pageContent).join("\n\n");
      console.log("Context being sent to LLM:", contextText);
      return contextText;
    },
    question: new RunnablePassthrough(),
  },
  PromptTemplate.fromTemplate(
    `You are a helpful assistant for the Adama City Police.
    Answer the question using the context provided. If no specific information is found in the context, 
    provide a general helpful response about city safety.

    Context:
    {context}

    Question: {question}

    Answer:`
  ),
  llm,
  new StringOutputParser(),
]);



const privateChain = RunnableSequence.from([
  {
    context: privateRetriever.pipe((docs) =>
      docs.map((d) => d.pageContent).join("\n\n")
    ),
    question: new RunnablePassthrough(),
  },
  PromptTemplate.fromTemplate(
    `You are an AI analyst for the Adama City Police admin dashboard.

For SUPER_ADMIN/ADMIN: Provide deep insights, statistics, trends.
For OFFICER: Provide relevant case summaries only.

Context:
{context}

Question: {question}

Answer:`
  ),
  llm,
  new StringOutputParser(),
]);

// export async function queryAI(query: string, role?: string) {
//   if (!role || role === "PUBLIC") {
//     const result = await publicChain.invoke(query);
//     return { response: result, source: "public" };
//   }

//   if (["SUPER_ADMIN", "ADMIN"].includes(role)) {
//     const result = await privateChain.invoke(query);
//     return { response: result, source: "private-admin" };
//   }

//   if (role === "OFFICER") {
//     const officerRetriever = privateStore.asRetriever({ k: 5 });
//     const officerChain = RunnableSequence.from([
//       {
//         context: officerRetriever.pipe((docs) =>
//           docs.map((d) => d.pageContent).join("\n\n")
//         ),
//         question: new RunnablePassthrough(),
//       },
//       PromptTemplate.fromTemplate(
//         `You are an AI assistant for police officers. Provide relevant case summaries only.

// Context:
// {context}

// Question: {question}

// Answer:`
//       ),
//       llm,
//       new StringOutputParser(),
//     ]);
//     const result = await officerChain.invoke(query);
//     return { response: result, source: "private-officer" };
//   }

//   return { response: "Access denied.", source: "none" };
// }


// Indexing functions — now use Cohere embeddings (no OpenAI quota error)
export async function queryAI(query: string, role?: string) {
  console.log(`--- AI Query Start (Role: ${role || "PUBLIC"}) ---`);

  try {
    // 1. PUBLIC ROLE
    if (!role || role === "PUBLIC") {
      // We pass the string directly because your publicChain starts with a function
      // that maps the string to the context.
      const result = await publicChain.invoke(query);
      return { response: result, source: "public" };
    }

    // 2. ADMIN ROLES
    if (["SUPER_ADMIN", "ADMIN"].includes(role)) {
      // If your privateChain follows the same structure as publicChain:
      const result = await privateChain.invoke(query);
      return { response: result, source: "private-admin" };
    }

    // 3. OFFICER ROLE
    if (role === "OFFICER") {
      const officerRetriever = privateStore.asRetriever({ k: 5 });
      const officerChain = RunnableSequence.from([
        {
          context: officerRetriever.pipe((docs) =>
            docs.map((d) => d.pageContent).join("\n\n")
          ),
          question: new RunnablePassthrough(),
        },
        PromptTemplate.fromTemplate(
          `You are an AI assistant for police officers. Provide relevant case summaries only.
          Context: {context}
          Question: {question}
          Answer:`
        ),
        llm,
        new StringOutputParser(),
      ]);

      // Note: officerChain expects a string because of RunnablePassthrough
      const result = await officerChain.invoke(query);
      return { response: result, source: "private-officer" };
    }

    return { response: "Access denied.", source: "none" };

  } catch (error: any) {
    console.error("Critical AI Service Error:", error);

    // Check for specific Groq/Quota errors
    if (error.message.includes("413") || error.message.includes("limit")) {
      return { error: "The AI is currently busy. Please try a shorter question.", response: null };
    }

    return { error: error.message || "An unexpected error occurred", response: null };
  }
}
// export async function indexPublicData() {
//   console.log("Indexing public notices...");
//   const notices = await prisma.notice.findMany({
//     where: { isPublished: true },
//   });

//   const docs = notices.map((n) => ({
//     pageContent: `${n.title}\n${n.content}\n${n.description || ""}`,
//     metadata: { id: n.id, type: "notice" },
//   }));

//   if (docs.length > 0) {
//     await publicStore.addDocuments(docs);
//     console.log(`Indexed ${docs.length} public notices`);
//   } else {
//     console.log("No published notices to index");
//   }
// }
// Indexing functions — Improved with "Clear Namespace" logic
export async function indexPublicData() {
  console.log("Cleaning and Indexing public notices...");

  // 1. Fetch from DB
  const notices = await prisma.notice.findMany({
    where: { isPublished: true },
  });

  const docs = notices.map((n) => ({
    pageContent: `Title: ${n.title}\nContent: ${n.content}\nDescription: ${n.description || ""}`,
    metadata: { id: n.id, type: "notice" },
  }));

  if (docs.length > 0) {
    // 2. DELETE existing vectors in this namespace to avoid duplicates
    // This stops you from seeing "Vehicle Theft" 5 times
    await index.namespace("public-notices").deleteAll();

    // 3. Add fresh documents
    await publicStore.addDocuments(docs);
    console.log(`Successfully indexed ${docs.length} fresh public notices`);
  } else {
    console.log("No published notices to index");
  }
}
export async function indexPrivateData() {
  console.log("Indexing private data...");

  // Include the related location so we can use its fields (city, subCity, kebele)
  const reports = await prisma.report.findMany({
    include: { location: true }
  });

  const contacts = (prisma as any).contact ? await (prisma as any).contact.findMany() : [];

  const reportDocs = reports.map((r) => {
    // r.location may be present thanks to `include`; guard with any to avoid strict type issues
    const loc = (r as any).location;
    const locationStr = loc
      ? `${loc.city}${loc.subCity ? ', ' + loc.subCity : ''}${loc.kebele ? ', ' + loc.kebele : ''}`
      : (r as any).locationId ?? "Unknown";

    return {
      pageContent: `Report: ${r.title}\n${r.description}\nStatus: ${r.status}\nLocation: ${locationStr}`,
      metadata: { id: r.id, type: "report" },
    };
  });

  const contactDocs = contacts.map((c: { subject: any; message: any; firstName: any; lastName: any; email: any; id: any; }) => ({
    pageContent: `Contact: ${c.subject}\n${c.message}\nFrom: ${c.firstName} ${c.lastName} (${c.email})`,
    metadata: { id: c.id, type: "contact" },
  }));

  const allDocs = [...reportDocs, ...contactDocs];

  if (allDocs.length > 0) {
    await privateStore.addDocuments(allDocs);
    console.log(`Indexed ${allDocs.length} private documents`);
  } else {
    console.log("No private data to index");
  }
}

// Duplicate/standalone snippet removed: indexPrivateData now includes location and constructs a safe location string.