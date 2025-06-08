import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const carData = [
  { id: 1, model: 'Toyota Camry', price: '$15,000', desc: 'A smooth sedan.', image: require('../../assets/images/img1.png') },
  { id: 2, model: 'Honda Accord', price: '$13,800', desc: 'Reliable and stylish.', image: require('../../assets/images/img2.png') },
  { id: 3, model: 'Nissan Altima', price: '$12,500', desc: 'Efficient and compact.', image: require('../../assets/images/img3.png') },
];

export default function CarDetails() {
  const { model } = useLocalSearchParams();
  const router = useRouter();

  const car = carData.find((c) => c.model.toLowerCase() === String(model).toLowerCase());
  const suggestions = carData.filter((c) => c.model !== model);

  if (!car) return <Text style={styles.notFound}>Car not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={car.image} style={styles.image} />
      <Text style={styles.model}>{car.model}</Text>
      <Text style={styles.price}>{car.price}</Text>
      <Text style={styles.desc}>{car.desc}</Text>

      <Text style={styles.suggestTitle}>You might also like:</Text>
      {suggestions.map((sug) => (
        <TouchableOpacity
          key={sug.id}
          style={styles.suggestCard}
          //onPress={() => router.push({ pathname: `/cardetails/${sug.model}`, params: { model: sug.model } })}
        >
          <Image source={sug.image} style={styles.suggestImage} />
          <View>
            <Text style={styles.suggestModel}>{sug.model}</Text>
            <Text style={styles.suggestPrice}>{sug.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: '100%', height: 250, borderRadius: 10, marginBottom: 20 },
  model: { fontSize: 26, fontWeight: 'bold' },
  price: { fontSize: 20, marginVertical: 8 },
  desc: { fontSize: 16, color: '#555' },
  suggestTitle: { fontSize: 18, marginTop: 30, fontWeight: 'bold', marginBottom: 10 },
  suggestCard: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  suggestImage: { width: 70, height: 50, borderRadius: 6, marginRight: 10 },
  suggestModel: { fontSize: 16 },
  suggestPrice: { color: '#333' },
  notFound: { padding: 20, fontSize: 18, textAlign: 'center' },
});
