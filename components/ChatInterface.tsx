import { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Container,
  Text,
  useToast,
  Flex,
  Avatar,
  IconButton,
} from '@chakra-ui/react';
import { SendIcon } from './Icons';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant' as const, content: data.message };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch" h="80vh">
        <Box
          flex={1}
          overflowY="auto"
          borderRadius="md"
          bg="gray.50"
          p={4}
          boxShadow="sm"
        >
          {messages.map((message, index) => (
            <Flex
              key={index}
              mb={4}
              flexDirection={message.role === 'user' ? 'row-reverse' : 'row'}
              alignItems="start"
              gap={2}
            >
              <Avatar
                size="sm"
                name={message.role === 'user' ? 'User' : 'AI Assistant'}
                bg={message.role === 'user' ? 'blue.500' : 'green.500'}
              />
              <Box
                maxW="70%"
                bg={message.role === 'user' ? 'blue.500' : 'white'}
                color={message.role === 'user' ? 'white' : 'black'}
                p={3}
                borderRadius="lg"
                boxShadow="sm"
              >
                <Text>{message.content}</Text>
              </Box>
            </Flex>
          ))}
        </Box>
        <Flex gap={2}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about investing..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton
            colorScheme="blue"
            aria-label="Send message"
            icon={<SendIcon />}
            isLoading={isLoading}
            onClick={handleSend}
          />
        </Flex>
      </VStack>
    </Container>
  );
} 