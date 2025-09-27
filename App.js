import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Platform, Keyboard, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [listaTarefas, setListaTarefas] = useState([]);

  const adicionarTarefa = () => {
    if (!tarefa.trim()) return;
    setListaTarefas([...listaTarefas, { key: Math.random().toString(), valor: tarefa.trim() }]);
    setTarefa('');
    Keyboard.dismiss();
  };

const removerTarefa = (key, valor) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`Deseja excluir a tarefa: "${valor}"?`)) {
      setListaTarefas(listaTarefas.filter((t) => t.key !== key));
    }
  } else {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir a tarefa: "${valor}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => setListaTarefas(listaTarefas.filter((t) => t.key !== key)),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }
};

  const mostrarTarefa = ({ item }) => (
    <View style={styles.tarefaContainer}>
      <Text style={styles.tarefaTexto}>{item.valor}</Text>
      <TouchableOpacity
        style={styles.botaoDeletar}
        onPress={() => removerTarefa(item.key, item.valor)}
      >
        <MaterialIcons name="delete-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Text style={styles.titulo}>Minhas Tarefas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua nova tarefa..."
          placeholderTextColor="#9CA3AF"
          value={tarefa}
          onChangeText={setTarefa}
          onSubmitEditing={adicionarTarefa}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.botaoAdicionar, !tarefa.trim() && styles.botaoDesativado]}
          onPress={adicionarTarefa}
          disabled={!tarefa.trim()}
        >
          <MaterialIcons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {listaTarefas.length > 0 ? (
          <FlatList
            data={listaTarefas}
            renderItem={mostrarTarefa}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <View style={styles.listaVaziaContainer}>
            <MaterialIcons
              name="event-note"
              size={50}
              color="#CBD5E1"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.listaVaziaTexto}>
              Não há nenhuma tarefa criada. Comece adicionando uma!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
  },
  titulo: {
    fontSize: 34,
    fontWeight: '900',
    color: '#9333EA',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#4B4B4B',
    borderRadius: 16,
    paddingHorizontal: 18,
    backgroundColor: '#1E1E1E',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 12,
    fontWeight: '500',
    elevation: 4,
  },
  botaoAdicionar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  botaoDesativado: {
    backgroundColor: '#4B4B4B',
    elevation: 2,
  },
  tarefaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#9333EA',
    elevation: 3,
  },
  tarefaTexto: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
    marginRight: 15,
  },
  botaoDeletar: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#B91C1C',
  },
  listaVaziaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  listaVaziaTexto: {
    textAlign: 'center',
    fontSize: 16,
    color: '#A1A1AA',
    fontWeight: '500',
    lineHeight: 24,
  },
});