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
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    justifyContent: 'center',
  },
  

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 30, // 50% do tamanho para deixá-la redonda
    marginRight: 10,
  },
  logo: {
    width: 230,
    height: 230,
    borderRadius: 115,
    marginBottom: 20,
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
    width: 280,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2F80ED',
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 20,
    textDecorationLine: 'none',
  },
  inputContainer: {
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.7)',
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
    left: -15,
  },
});

export default globalStyles;