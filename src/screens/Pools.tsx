import { Icon, useToast, VStack, FlatList } from "native-base";
import { Header } from "../components/Header";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { PoolCard, PoolCardPros } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { useFocusEffect } from "@react-navigation/native";


export function Pools() {
    const [isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState<PoolCardPros[]>([]);

    const { navigate } = useNavigation();

    const toast = useToast();

    async function fetchPools() {
        try {
            setIsLoading(true)
            const response = await api.get('/pools');
            setPools(response.data.pools);

        } catch (error) {
            setIsLoading(false)

            toast.show({
                title: 'Não foi possível carregar os bolões',
                placement: 'top',
                bgColor: 'red.500'
            })

        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchPools();
    }, []))

    return (
        <VStack bgColor="gray.900" flex={1}>
            <Header title="Meus bolões" />
            <VStack mt={6} mx={5} alignItems="center" borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button
                    title="BUSCAR BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons} name='search' color="black" size="md" />}
                    onPress={() => navigate('find')}
                />
            </VStack>

            {
                isLoading ?
                    <Loading /> :
                    <FlatList
                        data={pools}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <PoolCard data={item} onPress={() => navigate('details', { id: item.id })} />
                        )}
                        px={5}
                        showsVerticalScrollIndicator={false}
                        _contentContainerStyle={{ pb: 10 }}
                        ListEmptyComponent={() => <EmptyPoolList />}
                    />
            }

        </VStack>
    );
}