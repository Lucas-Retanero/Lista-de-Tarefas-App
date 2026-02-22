import { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Alert, Platform, Keyboard, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [listaTarefas, setListaTarefas] = useState([]);
  const [editandoKey, setEditandoKey] = useState(null);
  const inputRef = useRef(null);

  // Adicionar ou Salvar Edição
  const salvarTarefa = () => {
    if (!tarefa.trim()) return;

    if (editandoKey) {
      // Lógica de Edição
      setListaTarefas(listaTarefas.map(t => 
        t.key === editandoKey ? { ...t, valor: tarefa.trim() } : t
      ));
      setEditandoKey(null);
    } else {
      // Lógica de Adição
      setListaTarefas([...listaTarefas, { 
        key: Math.random().toString(), 
        valor: tarefa.trim(),
        concluida: false 
      }]);
    }

    setTarefa('');
    Keyboard.dismiss();
  };

  const iniciarEdicao = (item) => {
    setTarefa(item.valor);
    setEditandoKey(item.key);
    inputRef.current?.focus();
  };

  const alternarConcluida = (key) => {
    setListaTarefas(listaTarefas.map(t => 
      t.key === key ? { ...t, concluida: !t.concluida } : t
    ));
  };

  const removerTarefa = (key, valor) => {
    const acaoExcluir = () => {
      setListaTarefas(listaTarefas.filter((t) => t.key !== key));
      if (editandoKey === key) {
        setEditandoKey(null);
        setTarefa('');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Deseja excluir a tarefa: "${valor}"?`)) acaoExcluir();
    } else {
      Alert.alert('Confirmar Exclusão', `Deseja excluir: "${valor}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: acaoExcluir, style: 'destructive' },
      ]);
    }
  };

  const mostrarTarefa = ({ item }) => (
    <View style={[styles.tarefaContainer, item.concluida && { opacity: 0.6 }]}>
      {/* Checkbox */}
      <Pressable onPress={() => alternarConcluida(item.key)} style={styles.checkbox}>
        <MaterialIcons 
          name={item.concluida ? "check-box" : "check-box-outline-blank"} 
          size={24} 
          color={item.concluida ? "#9333EA" : "#9CA3AF"} 
        />
      </Pressable>

      <Text style={[
        styles.tarefaTexto, 
        item.concluida && { textDecorationLine: 'line-through', color: '#9CA3AF' }
      ]}>
        {item.valor}
      </Text>

      <View style={styles.botoesAcao}>
        {/* Botão Editar */}
        <Pressable 
          style={[styles.botaoAcao, styles.botaoEditar]} 
          onPress={() => iniciarEdicao(item)}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
        </Pressable>

        {/* Botão Deletar */}
        <Pressable 
          style={[styles.botaoAcao, styles.botaoDeletar]} 
          onPress={() => removerTarefa(item.key, item.valor)}
        >
          <MaterialIcons name="delete-outline" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Text style={styles.titulo}>Minhas Tarefas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={editandoKey ? "Editando tarefa..." : "Digite sua nova tarefa..."}
          placeholderTextColor="#9CA3AF"
          value={tarefa}
          onChangeText={setTarefa}
          onSubmitEditing={salvarTarefa}
          returnKeyType="done"
        />
        <Pressable
          style={({ pressed }) => [
            styles.botaoAdicionar,
            !tarefa.trim() && styles.botaoDesativado,
            pressed && { opacity: 0.7 }
          ]}
          onPress={salvarTarefa}
          disabled={!tarefa.trim()}
        >
          <MaterialIcons name={editandoKey ? "check" : "add"} size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        {listaTarefas.length > 0 ? (
          <FlatList
            data={listaTarefas}
            renderItem={mostrarTarefa}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          />
        ) : (
          <View style={styles.listaVaziaContainer}>
            <MaterialIcons name="event-note" size={50} color="#CBD5E1" style={{ marginBottom: 10 }} />
            <Text style={styles.listaVaziaTexto}>Não há nenhuma tarefa criada.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#121212', paddingTop: 40 },
  titulo: { fontSize: 34, fontWeight: '900', color: '#9333EA', textAlign: 'center', marginTop: 25, marginBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 25 },
  input: {
    flex: 1, height: 56, borderWidth: 1, borderColor: '#4B4B4B', borderRadius: 16,
    paddingHorizontal: 18, backgroundColor: '#1E1E1E', fontSize: 16, color: '#FFFFFF',
    marginRight: 12, fontWeight: '500', elevation: 4,
  },
  botaoAdicionar: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#9333EA', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  botaoDesativado: { backgroundColor: '#4B4B4B' },
  tarefaContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E',
    paddingVertical: 15, paddingHorizontal: 15, borderRadius: 16, marginBottom: 16,
    borderLeftWidth: 6, borderLeftColor: '#9333EA', elevation: 3,
  },
  checkbox: { marginRight: 10 },
  tarefaTexto: { fontSize: 16, color: '#FFFFFF', fontWeight: '600', flex: 1 },
  botoesAcao: { flexDirection: 'row' },
  botaoAcao: { padding: 8, borderRadius: 10, marginLeft: 8 },
  botaoEditar: { backgroundColor: '#9333EA' },
  botaoDeletar: { backgroundColor: '#B91C1C' },
  listaVaziaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  listaVaziaTexto: { textAlign: 'center', fontSize: 16, color: '#A1A1AA', fontWeight: '500' },
});