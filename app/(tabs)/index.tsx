import Calendar from "@/components/Calendar";
import EventList from "@/components/EventList";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const windowHeight = Dimensions.get("window").height;

const Index = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Animated.ScrollView
          style={[styles.container]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"pink"} //ios
              title="새로 고침 중..." //ios
              colors={["pink", "skyblue"]} //android
              progressBackgroundColor={"grey"} //android
            />
          }
        >
          <Animated.View
            style={[
              styles.calendarContainer,
              {
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [0, 150],
                      outputRange: [0, -50],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.calendarContainer}>
              <Calendar />
            </View>
            <View style={styles.listContainer}>
              <EventList />
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    minHeight: windowHeight,
    height: "100%",
  },
  calendarContainer: {
    flex: 1.5,
  },
  listContainer: {
    flex: 1,
  },
});

export default Index;
