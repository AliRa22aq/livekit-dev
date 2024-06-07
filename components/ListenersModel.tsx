import { Box, Button, Center, Flex, HStack, Input, Textarea, VStack, Checkbox, Select, Modal, ModalOverlay, ModalContent, ModalHeader, Text, CloseButton, ModalBody, ModalFooter, Icon, Tooltip } from '@chakra-ui/react'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { LocalParticipant, RemoteParticipant } from 'livekit-client';
import { avatarSeed } from '../pages/clubhouse';

const ListenersModel = ({ isOpen, onClose, listeners }: {
    isOpen: boolean;
    onClose: () => void;
    listeners: (RemoteParticipant | LocalParticipant)[]
}) => {


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent border="1px solid yellow" my="auto">

                <ModalHeader>
                    <Flex justify="space-between" align="center">
                        <Text>
                            Listeners
                        </Text>
                        <HStack>
                            {/* <ModalButton /> */}
                            <CloseButton color="white" onClick={onClose} />
                        </HStack>
                    </Flex>
                </ModalHeader>


                <ModalBody my="auto">
                    <Box>
                        {
                            listeners.map((listener, index) => {
                                const id = avatarSeed[Math.floor(Math.random() * avatarSeed.length)]



                                return (
                                    <HStack title={listener.name} key={index} w="full" justify="space-between">
                                        <HStack w="fit-content" spacing={0} width={50}>
                                            <Box
                                                borderRadius="50px"
                                                border="3px solid transparent"
                                                as="img"
                                                src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${id}`}
                                                className="fade-in"
                                                width={50}
                                                height={50}
                                                alt={`Avatar of user: ${listener.identity}`}
                                            />
                                            <Box>{listener.name}</Box>
                                        </HStack>

                                        <Box>
                                            <CloseButton color="red" />
                                        </Box>
                                    </HStack>
                                )
                            })
                        }
                    </Box>
                </ModalBody>


                {/* <ModalFooter >
                    <Flex w="80%" mx="auto" p="16px" >
                        <Button
                            mx="auto"
                            // onClick={handleStart}
                            // isDisabled={!amaData.description || !amaData.title || isProcessing || !displayFile?.data}
                            // isLoading={isProcessing}
                            // loadingText='Processing'
                            // spinnerPlacement='end'
                        >
                            Create
                        </Button>
                    </Flex>
                </ModalFooter> */}

            </ModalContent>
        </Modal>

    )
}

export default ListenersModel