if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:
        'mongodb://bill:bill@ds249325.mlab.com:49325/diamond-prod'}
        }else {
    module.exports = {mongoURI: 'mongodb://localhost/project-dev'}  
        }