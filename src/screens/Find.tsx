import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {

    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');
    const toast = useToast();
    const {navigate} = useNavigation();

    async function handleJoinPoll() {
        try {
            setIsLoading(true);

            if(!code) {
                return toast.show({
                    title: 'Informe o codigo',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }

            await api.post('/pools/join', {code});

            toast.show({
                title: 'Você entrou no bolão com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            });

            navigate('pool');

        } catch (error) {
            setIsLoading(false);
            if(error.response?.data?.message){
                return toast.show({
                    title: error.response.data.message,
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }            
            toast.show({
                title: 'Não foi possível encotrar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        } 
    }

    return (
        <VStack bgColor="gray.900" flex={1}>
            <Header title="Buscar por código" showBackButton />
            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontre um bolão através de seu código único
                </Heading>

                <Input mb={2} placeholder="Qual o código do bolão?" onChangeText={setCode} value={code} autoCapitalize="characters"/>

                <Button title="BUSCAR BOLÃO" isLoading={isLoading} onPress={handleJoinPoll}></Button>

            </VStack>
        </VStack>
    );
}