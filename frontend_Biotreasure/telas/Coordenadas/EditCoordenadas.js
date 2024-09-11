import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { editarCoordenadas, lerAnimais } from '../../utils/servidor_real';
import { Picker } from '@react-native-picker/picker';

const EditCoordenada = ({ route, navigation }) => {
  const { coordenada } = route.params; // Coordenada já passada como parâmetro
  const [latitude, setLatitude] = useState(coordenada.latitude);
  const [longitude, setLongitude] = useState(coordenada.longitude);
  const [animalId, setAnimalId] = useState(coordenada.animal_id || null); // Inicializa com o ID do animal, se existir
  const [animais, setAnimais] = useState([]);

  // Busca os animais apenas uma vez ao carregar o componente
  useEffect(() => {
    const fetchAnimais = async () => {
      try {
        const listaAnimais = await lerAnimais();
        setAnimais(listaAnimais);
      } catch (error) {
        console.error('Erro ao buscar animais:', error);
        Alert.alert('Erro', 'Falha ao buscar animais.');
      }
    };

    fetchAnimais();
  }, []);

  const handleEditCoordenada = async () => {
    // Validação dos campos
    if (!latitude || !longitude || !animalId) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const coordenadaEditada = { ...coordenada, latitude, longitude, animal_id: animalId };

    try {
      const edited = await editarCoordenadas(coordenadaEditada);
      if (edited) {
        Alert.alert('Sucesso', 'Coordenada editada com sucesso!');
        navigation.navigate('ListCoordenadas'); // Redireciona para a lista após a edição
      } else {
        Alert.alert('Erro', 'Falha ao editar a coordenada.');
      }
    } catch (error) {
      console.error('Erro ao editar coordenada:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao editar a coordenada.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Latitude:</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
      />
      <Text style={styles.label}>Longitude:</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
      />
      <Text style={styles.label}>Animal:</Text>
      <Picker
        selectedValue={animalId}
        onValueChange={(itemValue) => setAnimalId(itemValue)}
        style={styles.picker}
      >
        {animais.map((animal) => (
          <Picker.Item key={animal.id} label={animal.nome} value={animal.id} />
        ))}
      </Picker>
      <Button title="Salvar" onPress={handleEditCoordenada} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  picker: { height: 50, marginBottom: 16 },
});

export default EditCoordenada;
