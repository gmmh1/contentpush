import { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000";

type Post = {
  id: string;
  content: string;
  platform: string;
  status: string;
  publishAt: string | null;
};

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Request failed");
  }

  return response.json();
}

export default function App() {
  const [email, setEmail] = useState("founder@example.com");
  const [password, setPassword] = useState("Password123");
  const [topic, setTopic] = useState("Mobile marketing ideas");
  const [generated, setGenerated] = useState("");
  const [postContent, setPostContent] = useState("Ship weekly updates.");
  const [platform, setPlatform] = useState("x");
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState("Ready");

  const userHint = useMemo(() => "First registered account becomes admin", []);

  async function register() {
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setStatus("Registered successfully.");
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  async function login() {
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      await AsyncStorage.setItem("token", data.token);
      setStatus("Logged in.");
      await refreshPosts();
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  async function generate() {
    try {
      const data = await apiFetch("/ai/generate", {
        method: "POST",
        body: JSON.stringify({ topic })
      });
      setGenerated(data.content);
      setStatus("Generated content.");
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  async function createPost() {
    try {
      await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify({ content: postContent, platform })
      });
      setStatus("Post created.");
      await refreshPosts();
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  async function refreshPosts() {
    try {
      const data = await apiFetch("/posts");
      setPosts(data);
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  useEffect(() => {
    refreshPosts();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>ContentPush Mobile</Text>
        <Text style={styles.caption}>{userHint}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Authentication</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
          <View style={styles.row}>
            <ActionButton title="Register" onPress={register} />
            <ActionButton title="Login" onPress={login} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>AI Generator</Text>
          <TextInput style={styles.input} value={topic} onChangeText={setTopic} />
          <ActionButton title="Generate" onPress={generate} />
          <Text style={styles.pre}>{generated}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Create Post</Text>
          <TextInput style={styles.input} value={postContent} onChangeText={setPostContent} multiline />
          <TextInput style={styles.input} value={platform} onChangeText={setPlatform} autoCapitalize="none" />
          <View style={styles.row}>
            <ActionButton title="Save Post" onPress={createPost} />
            <ActionButton title="Refresh" onPress={refreshPosts} />
          </View>
          {posts.map(post => (
            <View key={post.id} style={styles.postItem}>
              <Text style={styles.postMeta}>{post.platform.toUpperCase()} · {post.status}</Text>
              <Text>{post.content}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.status}>Status: {status}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f7ff"
  },
  container: {
    padding: 16,
    gap: 12
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a"
  },
  caption: {
    color: "#334155"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#dbe7ff",
    gap: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff"
  },
  row: {
    flexDirection: "row",
    gap: 8
  },
  button: {
    backgroundColor: "#0f766e",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 4
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600"
  },
  pre: {
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    padding: 8
  },
  postItem: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
    marginTop: 8
  },
  postMeta: {
    color: "#475569",
    marginBottom: 4
  },
  status: {
    fontWeight: "600",
    color: "#0f172a"
  }
});
