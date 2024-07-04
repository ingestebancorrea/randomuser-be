const { response, request } = require('express');
const axios = require("axios");
const dotenv = require('dotenv').config()

const getRandomUsers = async(req = request, res = response) => {

    try{
        const results = await axios.get(`${process.env.HOST_URL}?results=5`);
        const users = results.data.results;

        const transformedUsers = users.map(user => ({
            name: `${user.name.first} ${user.name.last}`,
            gender: user.gender,
            username: user.login.username,
            password: user.login.password,
            phone: user.phone,
            cell: user.cell,
            location: {
                city: user.location.city,
                state: user.location.state,
                country: user.location.country
            },
            image_url: user.picture.large // user.picture.medium
        }));

        const calculateNames = await getNamesFromRandomUsers();

        res.json({
            "users": transformedUsers,
            "mostUsedLetter": calculateNames.mostUsedLetter,
            "ocurrences": calculateNames.ocurrences
        });
    }catch(error){
        console.error('Error fetching random users:', error);
        throw error;
    } 
}

const getNamesFromRandomUsers = async (req = request, res = response) => {
    try {
        const response = await axios.get(`${process.env.HOST_URL}?results=5`);
        const users = response.data.results;

        let fullNames = [];

        // Recorrer cada usuario y extraer el nombre completo
        users.forEach(user => {
            const fullName = `${user.name.first} ${user.name.last}`.toLowerCase(); // Convertir a minúsculas
            fullNames.push(fullName);
        });

        // Objeto para contar la frecuencia de cada letra
        let letterCount = {};

        // Contar la frecuencia de cada letra en todos los nombres completos
        fullNames.forEach(fullName => {
            for (let i = 0; i < fullName.length; i++) {
                const char = fullName.charAt(i);
                if (char.match(/[a-z]/i)) { // Verificar que sea una letra
                    if (letterCount[char]) {
                        letterCount[char]++;
                    } else {
                        letterCount[char] = 1;
                    }
                }
            }
        });

        // Encontrar la letra más utilizada
        let mostUsedLetter = '';
        let maxCount = 0;

        Object.keys(letterCount).forEach(letter => {
            if (letterCount[letter] > maxCount) {
                mostUsedLetter = letter;
                maxCount = letterCount[letter];
            }
        });

        console.log(`La letra más utilizada en los nombres completos es '${mostUsedLetter.toUpperCase()}' con ${maxCount} ocurrencias.`);

        return {
            "mostUsedLetter": mostUsedLetter.toUpperCase(),
            "ocurrences": maxCount
        }
    } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
        throw error;
    }
};

module.exports = {
    getRandomUsers
}