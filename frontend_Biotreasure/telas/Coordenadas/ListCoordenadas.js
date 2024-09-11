import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { lerCoordenadas, removerCoordenadas } from '../../utils/servidor_real';

const ListCoordenadas = ({ navigation }) => {
  const [coordenadas, setCoordenadas] = useState([]);

  // Define o botão de navegação no canto superior esquerdo
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => navigation.goBack()} // Volta para a tela anterior
          title="Voltar"
          color="#000"
        />
      ),
    });
  }, [navigation]);

  const fetchCoordenadas = async () => {
    try {
      const data = await lerCoordenadas();
      console.log('Dados recebidos:', data); // Log para verificar os dados recebidos
      setCoordenadas(data || []);
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
    }
  };

  useEffect(() => {
    fetchCoordenadas();
  }, []);

  const handleRemoveCoordenada = async (coordenada) => {
    try {
      const removed = await removerCoordenadas(coordenada);
      if (removed) {
        setCoordenadas(coordenadas.filter(c => c.id !== coordenada.id));
        Alert.alert('Sucesso', 'Coordenada removida com sucesso!');
      } else {
        Alert.alert('Erro', 'Falha ao remover a coordenada.');
      }
    } catch (error) {
      console.error('Erro ao remover coordenada:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao remover a coordenada.');
    }
  };

  return (
    <View style={styles.container}>
      {coordenadas.length > 0 ? (
        <FlatList
          data={coordenadas}
          keyExtractor={(coordenada) => coordenada.id.toString()}
          renderItem={({ item: coordenada }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>ID: {coordenada.id}</Text>
              <Text style={styles.itemText}>Latitude: {coordenada.latitude}</Text>
              <Text style={styles.itemText}>Longitude: {coordenada.longitude}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Editar"
                  onPress={() => navigation.navigate('EditCoordenadas', { coordenada })}
                />
                <Button
                  title="Remover"
                  onPress={() => handleRemoveCoordenada(coordenada)}
                  color="red"
                />
              </View>
            </View>
          )}
        />
      ) : (
        <Text>Nenhuma coordenada encontrada.</Text> // Mostra uma mensagem quando não há dados
      )}
      <Button title="Adicionar Coordenada" onPress={() => navigation.navigate('AddCoordenadas')} color="green" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ListCoordenadas;
