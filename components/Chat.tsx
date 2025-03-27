import { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Container,
  useToast,
} from '@chakra-ui/react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResponse(data.response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Box
          p={6}
          borderWidth={1}
          borderRadius="lg"
          bg="white"
          boxShadow="sm"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask your financial question..."
                size="lg"
              />
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Getting response..."
              >
                Send
              </Button>
            </VStack>
          </form>
        </Box>

        {response && (
          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            bg="gray.50"
          >
            <Text whiteSpace="pre-wrap">{response}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
} 