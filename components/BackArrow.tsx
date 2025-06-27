import { TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import Icon from 'react-native-vector-icons/MaterialIcons';
function BackArrow({navigation}: any) {
    return (
        <TouchableOpacity
            style={globalStyles.backButton}
            onPress={() => navigation.goBack()}
        >
            <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
    )
}
function BackArrowMain({navigation,color}: any) {
    return (
        <TouchableOpacity
            style={globalStyles.backButtonMain}
            onPress={() => navigation.goBack()}
        >
            <Icon name="arrow-back" size={30} color={color || "#ffffff"} />
        </TouchableOpacity>
    )
}

export { BackArrow, BackArrowMain};