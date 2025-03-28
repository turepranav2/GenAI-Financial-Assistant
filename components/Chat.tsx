import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  Text,
  Container,
  Heading,
  useToast,
  VStack,
  HStack,
  Card,
  CardBody,
  Icon,
  Avatar,
  Divider,
  SimpleGrid,
  Badge,
  Flex,
  Tag,
  TagLabel,
  TagLeftIcon
} from '@chakra-ui/react';
import { FiSend, FiUser, FiCpu, FiDollarSign, FiPieChart, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const quickQuestions = [
  "How to start investing?",
  "Best retirement plan for me?",
  "Tax saving strategies?",
  "Should I refinance my mortgage?"
];

const financialWidgets = [
  {
    title: "Market Trends",
    icon: FiTrendingUp,
    description: "Current S&P 500: +1.2% today",
    color: "green"
  },
  {
    title: "Interest Rates",
    icon: FiBarChart2,
    description: "Fed rate: 5.25%-5.50%",
    color: "blue"
  },
  {
    title: "Your Portfolio",
    icon: FiPieChart,
    description: "Up 3.7% this month",
    color: "teal"
  }
];

export default function GenAIFinancialAssistant() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const geminiResponse: Message = {
        id: Date.now().toString() + 1,
        content: data.message,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, geminiResponse]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setPrompt(question);
  };

  return (
    <Container maxW="container.xl" py={8} centerContent>
      <VStack spacing={6} w="full" h="90vh" display="flex" flexDirection="column">
        <HStack spacing={3} pb={2}>
          <Icon as={FiDollarSign} boxSize={7} color="teal.500" />
          <Heading as="h1" size="xl" bgGradient="linear(to-r, teal.500, blue.600)" bgClip="text">
            GenAI Financial Assistant
          </Heading>
        </HStack>
        
        {/* Financial Widgets */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
          {financialWidgets.map((widget, index) => (
            <Card key={index} variant="outline" borderLeft={`4px solid`} borderLeftColor={`${widget.color}.400`}>
              <CardBody>
                <HStack spacing={3}>
                  <Icon as={widget.icon} boxSize={5} color={`${widget.color}.500`} />
                  <Box>
                    <Text fontWeight="bold">{widget.title}</Text>
                    <Text fontSize="sm" color="gray.600">{widget.description}</Text>
                  </Box>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Chat area */}
        <Box 
          flex="1" 
          w="full" 
          overflowY="auto" 
          p={4} 
          borderRadius="xl" 
          bg="white"
          boxShadow="md"
          borderWidth="1px"
          borderColor="gray.100"
        >
          {messages.length === 0 ? (
            <VStack h="full" justify="center" spacing={6} textAlign="center">
              <Box>
                <Text fontSize="lg" fontWeight="medium" color="gray.500" mb={2}>
                  How can I help with your finances today?
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Ask about investments, savings, or any financial topic
                </Text>
              </Box>
              
              <SimpleGrid columns={2} spacing={3} w="full">
                {quickQuestions.map((question, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    whiteSpace="normal"
                    height="auto"
                    py={2}
                    textAlign="left"
                  >
                    {question}
                  </Button>
                ))}
              </SimpleGrid>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              {messages.map((message) => (
                <Box 
                  key={message.id} 
                  alignSelf={message.isUser ? "flex-end" : "flex-start"}
                  maxW={{ base: '90%', md: '80%' }}
                >
                  <HStack align="flex-start" spacing={3}>
                    {!message.isUser && (
                      <Avatar 
                        size="sm" 
                        icon={<FiCpu />}
                        bg="blue.500"
                        color="white"
                      />
                    )}
                    <Card 
                      bg={message.isUser ? "teal.50" : "white"}
                      borderWidth="1px"
                      borderColor={message.isUser ? "teal.100" : "gray.200"}
                      borderRadius="xl"
                      boxShadow="sm"
                    >
                      <CardBody p={4}>
                        <Text whiteSpace="pre-wrap" fontSize="md">
                          {message.content}
                        </Text>
                        <Text fontSize="xs" color="gray.500" mt={2} textAlign="right">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </CardBody>
                    </Card>
                    {message.isUser && (
                      <Avatar 
                        size="sm" 
                        icon={<FiUser />}
                        bg="teal.500"
                        color="white"
                      />
                    )}
                  </HStack>
                </Box>
              ))}
              {isLoading && (
                <HStack align="flex-start" spacing={3}>
                  <Avatar size="sm" icon={<FiCpu />} bg="blue.500" color="white" />
                  <Card bg="white" borderWidth="1px" borderColor="gray.200" borderRadius="xl">
                    <CardBody p={4}>
                      <HStack spacing={2}>
                        <Box w="8px" h="8px" bg="blue.400" borderRadius="full" opacity={0.6} />
                        <Box w="8px" h="8px" bg="blue.400" borderRadius="full" opacity={0.4} />
                        <Box w="8px" h="8px" bg="blue.400" borderRadius="full" opacity={0.2} />
                      </HStack>
                    </CardBody>
                  </Card>
                </HStack>
              )}
              <div ref={messagesEndRef} />
            </VStack>
          )}
        </Box>

        {/* Input area */}
        <Box as="form" onSubmit={handleSubmit} w="full" pt={2}>
          <HStack spacing={3}>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask your financial question..."
              size="lg"
              borderRadius="full"
              borderColor="gray.300"
              _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
              px={6}
              py={5}
            />
            <Button
              type="submit"
              colorScheme="teal"
              borderRadius="full"
              px={7}
              height="48px"
              isLoading={isLoading}
              loadingText="Analyzing..."
              rightIcon={<FiSend />}
              boxShadow="md"
            >
              Send
            </Button>
          </HStack>
          
          {messages.length > 0 && (
            <Flex mt={3} wrap="wrap" gap={2}>
              <Text fontSize="sm" color="gray.500" mr={2}>Try asking:</Text>
              {quickQuestions.slice(0, 2).map((question, index) => (
                <Tag 
                  key={index}
                  variant="subtle" 
                  colorScheme="teal"
                  cursor="pointer"
                  onClick={() => handleQuickQuestion(question)}
                >
                  <TagLabel>{question}</TagLabel>
                </Tag>
              ))}
            </Flex>
          )}
        </Box>
      </VStack>
    </Container>
  );
}