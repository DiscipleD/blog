/**
 * Created by jack on 16-12-3.
 */


const SERVER = {
	HOST: 'http://localhost:8080'
};

if (process.env.NODE_ENV === 'production') {
	SERVER.HOST = 'http://discipled.me';
}

export default SERVER;
