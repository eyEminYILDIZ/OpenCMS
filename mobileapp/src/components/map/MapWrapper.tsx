import { SafeAreaView } from "react-native-safe-area-context";
import { stores } from "../../stores";
import { StyleSheet, View } from "react-native";

export const MapWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { operationStore } = stores;

    if (operationStore.selectedItem != null)
        return (<SafeAreaView style={styles.container}>
            {children}
        </SafeAreaView>)

    return <View style={styles.container}>{children}</View>
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
