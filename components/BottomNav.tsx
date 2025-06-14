import { TouchableOpacity, View } from "react-native";
import globalStyles from "../styles/globalStyles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BottomNav({ navigation }: { navigation: any }) {
  const currentRoute = navigation.getState().routes[navigation.getState().index].name;
  const navigateTo = (screen: string) => {
    navigation.navigate(screen);
  };
  const isActive = (screen: string) => {
    return currentRoute === screen;
  };

  return (
    <View style={globalStyles.bottomNav}>
      <TouchableOpacity onPress={() => navigateTo('Home')}>
        <Icon2 name={isActive('Home') ? "home" : "home-outline"} size={30} color='#000' />
        { isActive('Home')&& <View style={globalStyles.activeIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('Placeholder')}>
        <Icon name={isActive('Placeholder') ? "chat-bubble" : "chat-bubble-outline"} size={30} color='#000' />
        { isActive('Placeholder')&& <View style={globalStyles.activeIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('Placeholder')}>
        <Icon name={isActive('Placeholder') ? "favorite" : "favorite-outline"} size={30} color='#000' />
        { isActive('Placeholder')&& <View style={globalStyles.activeIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateTo('Placeholder')}>
        <Icon name={isActive('Placeholder') ? "person" : "person-outline"} size={30} color='#000' />
        { isActive('Placeholder')&& <View style={globalStyles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
}