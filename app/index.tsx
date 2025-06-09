import { getInitialMovie, searchMoview } from "@/api/service";
import { useApi } from "@/api/useApi";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieItem[]>([]);

  const {
    data: initialData,
    loading: loadingInitial,
    error: errorInitial,
    fetchData: fetchInitialMovies,
  } = useApi(getInitialMovie);

  const {
    data: searchData,
    loading: loadingSearch,
    error: errorSearch,
    fetchData: fetchSearchMovies,
  } = useApi(searchMoview);

  // Update movie list on successful fetch
  useEffect(() => {
    if (query.trim().length === 0 && initialData?.results) {
      setMovies(initialData.results);
    }
  }, [initialData, query]);

  useEffect(() => {
    if (query.trim() && searchData?.results) {
      setMovies(searchData.results);
    }
  }, [searchData]);

  // Debounced search
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      fetchInitialMovies(); // Fallback to default
      return;
    }

    const timer = setTimeout(() => {
      fetchSearchMovies(trimmedQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const loading = loadingInitial || loadingSearch;
  const error = errorSearch || errorInitial;

  const renderMovieItem = useMemo(
    () => ({ item }: { item: MovieItem }) => (
      <TouchableOpacity style={styles.movieItemContainer} activeOpacity={0.8}>
        {item.poster_path ? (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.posterImage, styles.imageFallback]}>
            <Text style={styles.imageFallbackText}>No Image</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {item.title || "Untitled"}
        </Text>
      </TouchableOpacity>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>🎬 Now Playing</Text>

      <TextInput
        placeholder="Search for a movie..."
        value={query}
        onChangeText={setQuery}
        style={styles.textInput}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      {loading && <ActivityIndicator size="large" color="#666" style={{ marginTop: 20 }} />}

      {error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          numColumns={2}
          ListEmptyComponent={
            movies && (
              <Text style={styles.emptyText}>No Movies Found</Text>
            )
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 12,
    backgroundColor: "#f4f4f4",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 25,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
  },
  movieItemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 6,
    width: "47%",
    elevation: 3,
    overflow: "hidden",
  },
  posterImage: {
    width: "100%",
    height: 200,
  },
  imageFallback: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1e1e1",
  },
  imageFallbackText: {
    color: "#666",
    fontSize: 12,
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    padding: 8,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 16,
    fontSize: 15,
  },
});
