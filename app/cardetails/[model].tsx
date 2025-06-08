import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const defaultImage = require('../../assets/images/car1.png');

const homeScreenModels = ['Toyota Camry', 'Honda Accord', 'Nissan Altima'];

const carData = [
  { id: 1, model: 'Toyota Camry', price: '$15,000', desc: 'A premium mid-size sedan offering smooth performance, modern features, and excellent fuel efficiency.', image: require('../../assets/images/img1.png') },
  { id: 2, model: 'Honda Accord', price: '$13,800', desc: 'A reliable and stylish sedan known for its spacious interior, smooth ride, and fuel economy.', image: require('../../assets/images/img2.png') },
  { id: 3, model: 'Nissan Altima', price: '$12,500', desc: 'A well-balanced sedan with a blend of comfort, safety, and tech features.', image: require('../../assets/images/img3.png') },
  { id: 4, model: 'Ford Mustang', price: '$27,000', desc: 'A legendary sports car delivering exhilarating power and iconic design.', image: defaultImage },
  { id: 5, model: 'Chevrolet Malibu', price: '$14,700', desc: 'A sleek and modern sedan offering comfort and high-tech connectivity.', image: defaultImage },
  { id: 6, model: 'BMW 3 Series', price: '$33,500', desc: 'A luxury sedan that balances performance, innovation, and elegance.', image: defaultImage },
  { id: 7, model: 'Audi A4', price: '$34,000', desc: 'An upscale and athletic sedan with intuitive tech and refined design.', image: defaultImage },
  { id: 8, model: 'Mercedes-Benz C-Class', price: '$36,500', desc: 'A classy and tech-forward sedan offering unmatched sophistication.', image: defaultImage },
  { id: 9, model: 'Tesla Model 3', price: '$39,000', desc: 'A revolutionary electric sedan with cutting-edge autopilot and fast acceleration.', image: defaultImage },
  { id: 10, model: 'Kia Optima', price: '$13,300', desc: 'A dependable family sedan with sporty looks and practical features.', image: defaultImage },
  { id: 11, model: 'Hyundai Elantra', price: '$11,900', desc: 'A compact and efficient sedan ideal for everyday commuting.', image: defaultImage },
  { id: 12, model: 'Mazda 6', price: '$16,000', desc: 'A stylish and fun-to-drive sedan with a premium interior.', image: defaultImage },
  { id: 13, model: 'Volkswagen Passat', price: '$14,300', desc: 'A European-style sedan that offers space and ride comfort.', image: defaultImage },
  { id: 14, model: 'Subaru Legacy', price: '$13,900', desc: 'A safe and all-weather capable sedan with AWD standard.', image: defaultImage },
  { id: 15, model: 'Lexus ES', price: '$39,500', desc: 'A refined and quiet luxury sedan with elegant styling.', image: defaultImage },
  { id: 16, model: 'Dodge Charger', price: '$29,000', desc: 'A bold and powerful sedan with muscle-car DNA.', image: defaultImage },
  { id: 17, model: 'Chrysler 300', price: '$28,700', desc: 'A full-size sedan with timeless style and strong presence.', image: defaultImage },
  { id: 18, model: 'Infiniti Q50', price: '$35,500', desc: 'A luxurious and high-performance sedan from Nissan’s premium brand.', image: defaultImage },
  { id: 19, model: 'Acura TLX', price: '$34,200', desc: 'A sporty luxury sedan that delivers precision and flair.', image: defaultImage },
  { id: 20, model: 'Jaguar XE', price: '$38,000', desc: 'A dynamic and agile British sedan with premium appeal.', image: defaultImage },
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
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
renderItem={({ item }) => (
  <View>
    <TouchableOpacity
      style={styles.suggestCard}
      onPress={() => router.push({ pathname: '/cardetails/[model]', params: { model: item.model } })}
    >
      <Image source={item.image} style={styles.suggestImage} />
      <Text style={styles.suggestModel}>{item.model}</Text>
      <Text style={styles.suggestPrice}>{item.price}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.sellButton}
      onPress={() => router.push({ pathname: '/sell/[model]', params: { model: car.model } })}
    >
      <Text style={styles.sellButtonText}>Sell this Car in Bitcoin</Text>
    </TouchableOpacity>
  </View>
)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, marginTop:60,backgroundColor: '#f9f9f9' },
  image: { width: '100%', height: 250, borderRadius: 12, marginBottom: 20 },
  model: { fontSize: 28, fontWeight: 'bold', color: '#111' },
  price: { fontSize: 22, marginVertical: 10, color: '#1a8e2d' },
  desc: { fontSize: 16, color: '#555', marginBottom: 20 },
  suggestTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 30, marginBottom: 10, color: '#333' },
  suggestCard: {
    width: 160,
    marginRight: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 8 },
  suggestModel: { fontSize: 16, fontWeight: '600' },
  suggestPrice: { color: '#444', fontSize: 14 },
  notFound: { padding: 20, fontSize: 18, textAlign: 'center', color: '#f00' },
  // Removed duplicate sellButton definition
  sellButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sellButton: {
    backgroundColor: '#F7931A', // Bitcoin orange
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  
});
