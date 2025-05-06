import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 30, // 50% do tamanho para deixá-la redonda
    marginRight: 10,
  },
  title: {
    fontSize: 62,
    fontFamily: 'Lobster-Regular',
    fontWeight: '400',
    color: '#FFFFFF',
    // marginBottom: 20,
    marginRight: 20,
  },
  subtitle: {
    fontSize: 20,
    fontFamily:'Roboto',
    fontWeight:500,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 60,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 300,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
});

export default globalStyles;