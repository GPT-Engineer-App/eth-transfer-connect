import React, { useState } from "react";

import { Container, VStack, Input, Button, Text, useToast, HStack, IconButton } from "@chakra-ui/react";
import { FaWallet, FaPaperPlane } from "react-icons/fa";

const Index = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const toast = useToast();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = window.ethereum;
        setProvider(newProvider);
        setSigner(newProvider.selectedAddress);
        setWalletConnected(true);
        toast({
          title: "Wallet connected",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error connecting wallet",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "No wallet found",
        description: "Please install MetaMask",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const sendETH = async () => {
    if (!recipient || !amount) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid recipient address and amount",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const txParams = {
        to: recipient,
        from: signer,
        value: window.ethereum.utils.toHex(window.ethereum.utils.toWei(amount, "ether")),
      };
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });
      toast({
        title: "Transaction successful",
        description: `Sent ${amount} ETH to ${recipient}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Web3 ETH Sender</Text>
        <Button leftIcon={<FaWallet />} colorScheme="teal" onClick={connectWallet} isDisabled={walletConnected}>
          {walletConnected ? "Wallet Connected" : "Connect Wallet"}
        </Button>
        <Input placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <Input placeholder="Amount in ETH" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button leftIcon={<FaPaperPlane />} colorScheme="teal" onClick={sendETH} isDisabled={!walletConnected}>
          Send ETH
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;
