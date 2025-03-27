'use client';

import { Box, Heading } from '@chakra-ui/react';
import Chat from '@/components/Chat';

export default function Home() {
  return (
    <Box maxW="100vw" minH="100vh" bg="gray.100">
      <Box bg="white" py={4} px={8} borderBottom="1px" borderColor="gray.200">
        <Heading size="lg" color="blue.600">
          GenAI Financial Assistant
        </Heading>
      </Box>
      <Chat />
    </Box>
  );
} 