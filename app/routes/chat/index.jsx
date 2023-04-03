import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
// import { postMessage } from "~/models/chat.server";

export const loader = async () => {
  return { OPENAI_API_KEY: process.env.OPENAI_API_KEY };
};

function Chat() {
  const loaderData = useLoaderData();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("How to send a http request?");
  const [errors, setErrors] = useState();

  const _handleChange = (e) => {
    setInputText(e.target.value);
  };

  const _handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: inputText }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loaderData.OPENAI_API_KEY}`,
          },
        }
      );
      setMessages((preState) => [
        ...preState,
        { text: inputText, isUser: true },
        { text: data.message, isUser: false },
      ]);
      setInputText("");
    } catch (err) {
      console.log(err);
      setErrors(err?.response?.data?.error);

      setMessages((preState) => [
        ...preState,
        { text: inputText, isUser: true },
        { text: "data.message", isUser: false },
      ]);
      setInputText("");
    }
  };

  return (
    <Container maxW="container.sm">
      <Flex justify="flex-end" flexDirection="column" h="100vh">
        <Box overflowX="hidden" overflowY="auto">
          {messages.map((message, index) => {
            const { isUser, text } = message;
            return (
              <Box
                key={index}
                py={1}
                wordBreak="break-word"
                className={isUser ? "user-message" : "bot-message"}
              >
                <Text as="b">{isUser ? "You: " : "GPT: "}</Text>
                {text}
              </Box>
            );
          })}
        </Box>

        <form style={{ paddingBottom: 40 }} onSubmit={_handleSubmit}>
          <Flex align="center">
            <Input type="text" value={inputText} onChange={_handleChange} />
            <Spacer />
            <Button
              type="submit"
              title="Send"
              size="md"
              variant="ghost"
              leftIcon={<SendIcon />}
            ></Button>
          </Flex>
          <Text fontSize="xs" color="tomato">
            {errors?.message}
          </Text>
        </form>
      </Flex>
    </Container>
  );
}

Chat.propTypes = {};

export default Chat;

const SendIcon = () => (
  <svg
    stroke="currentcolor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    class="h-4 w-4 mr-1"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
