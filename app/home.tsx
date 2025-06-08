import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const cars = [
  { id: 1, image: require("../assets/images/img1.png"), model: "Toyota Camry", price: "$15,000" },
  { id: 2, image: require("../assets/images/img2.png"), model: "Honda Accord", price: "$13,800" },
  { id: 3, image: require("../assets/images/img3.png"), model: "Nissan Altima", price: "$12,500" },
  { id: 4, image: require("../assets/images/img4.png"), model: "Honda i20", price: "$10,500" },
  { id: 5, image: require("../assets/images/ing5.png"), model: "CyberTruck Tesla", price: "$15,800" },
  { id: 6, image: require("../assets/images/ing6.png"), model: "Honda Civic", price: "$13,500" },
];

const carSuggestions = [
  "Toyota Camry", "Honda Accord", "Ford Mustang", "Chevrolet Malibu", "BMW 3 Series",
  "Audi A4", "Mercedes-Benz C-Class", "Tesla Model 3", "Kia Optima", "Hyundai Elantra",
  "Nissan Altima", "Mazda 6", "Volkswagen Passat", "Subaru Legacy", "Lexus ES",
  "Dodge Charger", "Chrysler 300", "Infiniti Q50", "Acura TLX", "Jaguar XE"
];

export default function HomeScreen() {
  const pathname = usePathname();
  const flatListRef = useRef<FlatList>(null);
  const scrollIndex = useRef(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [search, setSearch] = useState("");
  const [cryptoBalance, setCryptoBalance] = useState("Ξ2.35");
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const visibleCars = cars.slice(0, 3);

  useEffect(() => {
    if (params?.resetSearch) setSearch("");
  }, [params]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const uri = await SecureStore.getItemAsync("profile_image");
      setProfileImageUri(uri);
    };
    fetchProfileImage();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoScroll && flatListRef.current) {
        scrollIndex.current = (scrollIndex.current + 1) % visibleCars.length;
        try {
          flatListRef.current.scrollToIndex({ index: scrollIndex.current, animated: true });
        } catch (e) {
          console.warn("Scroll index out of range:", e);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [autoScroll]);

  const onScrollBeginDrag = () => setAutoScroll(false);
  const onScrollEndDrag = () => setAutoScroll(true);

  const filteredSuggestions = carSuggestions.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()) && search.length > 0
  );

  const handleCarSelection = async (model: string) => {
    setSearch(model);

    const isLoggedIn = await SecureStore.getItemAsync("isLoggedIn");
    const isVerified = await SecureStore.getItemAsync("isVerified");

    if (isLoggedIn === "true" && isVerified === "true") {
      router.push({ pathname: `/cardetails/[model]`, params: { model } });
    } else {
      router.push({
        pathname: "/identity/register",
        params: {
          redirectTo: `/cardetails/${model}`,
          model,
        },
      });
    }
  };

  const clearSearch = () => setSearch("");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.fixedHeader}>
        <View style={styles.statusBarSpacer} />
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push("/identity/options")}>
            <View style={styles.logoCircle}>
              <Image
                source={
                  profileImageUri
                    ? { uri: profileImageUri }
                    : require("../assets/images/default-user.png")
                }
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.cryptoBalance}>{cryptoBalance}</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="What car model are you searching for?"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            style={styles.searchBar}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {filteredSuggestions.length > 0 && (
        <View style={styles.floatingSuggestionsBox}>
          {filteredSuggestions.map((model, idx) => (
            <TouchableOpacity key={idx} onPress={() => handleCarSelection(model)}>
              <Text style={styles.suggestionItem}>{model}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={visibleCars}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Value Deal</Text>
              <FlatList
                data={cars}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={()=> handleCarSelection(item.model)} style={styles.carCardHorizontal}>
                    <Image source={item.image} style={styles.carImageFixed} resizeMode="contain" />
                    <Text style={styles.carModel}>{item.model}</Text>
                    <Text style={styles.carPrice}>{item.price}</Text>
                    <Text style={styles.learnMore}>Learn more about the car</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Deals of week</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCarSelection(item.model)} style={styles.carCardVertical}>
            <Image source={item.image} style={styles.carImageFixed} resizeMode="contain" />
            <Text style={styles.carModel}>{item.model}</Text>
            <Text style={styles.carPrice}>{item.price}</Text>
            <Text style={styles.learnMore}>Learn more about the car</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons
            name="home-outline"
            size={28}
            color={pathname === "/home" ? "#1a8e2d" : "#000"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/chat')}>
          <Ionicons
            name="chatbubble-outline"
            size={28}
            color={pathname === "/chat" ? "#1a8e2d" : "#000"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons
            name="settings-outline"
            size={28}
            color={pathname === "/settings" ? "#1a8e2d" : "#000"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  statusBarSpacer: { height: Platform.OS === "android" ? StatusBar.currentHeight || 20 : 40 },
  logo: { width: 60, height: 60 },
  fixedHeader: { backgroundColor: "#000", paddingHorizontal: 20, paddingBottom: 20, zIndex: 2 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cryptoBalance: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    marginTop:10,
    marginBottom:10,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  searchContainer: { position: "relative" },
  searchBar: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 45,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 16,
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    
  },
  clearIcon: { position: "absolute", right: 15, top: 28 },
  floatingSuggestionsBox: {
    position: "absolute",
    top: Platform.OS === "android" ? 150 : 160,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  suggestionItem: { paddingVertical: 6, fontSize: 14, color: "#333" },
  section: { padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  carCardHorizontal: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    flex: 1,
  },
  carCardVertical: {
    width: width - 30,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  carImageFixed: { width: "100%", height: 160, borderRadius: 10 },
  carModel: { fontWeight: "600", marginTop: 5 },
  carPrice: { color: "#333", marginBottom: 5 },
  learnMore: { fontSize: 12, color: "#2E7D32" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
});
