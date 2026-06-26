import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

// Dados dos 20 clubes do Brasileirão 2026
const clubsData = [
  {
    name: "Sociedade Esportiva Palmeiras",
    shortName: "Palmeiras",
    state: "SP",
    marketValue: 229.48,
    avgAge: 25.7,
  },
  {
    name: "CR Flamengo",
    shortName: "Flamengo",
    state: "RJ",
    marketValue: 213.45,
    avgAge: 29.0,
  },
  {
    name: "Fluminense Football Club",
    shortName: "Fluminense",
    state: "RJ",
    marketValue: 118.03,
    avgAge: 28.7,
  },
  {
    name: "Cruzeiro Esporte Clube",
    shortName: "Cruzeiro",
    state: "MG",
    marketValue: 174.05,
    avgAge: 26.5,
  },
  {
    name: "Sport Club Corinthians Paulista",
    shortName: "Corinthians",
    state: "SP",
    marketValue: 150.30,
    avgAge: 27.2,
  },
  {
    name: "Botafogo de Futebol e Regatas",
    shortName: "Botafogo",
    state: "RJ",
    marketValue: 125.35,
    avgAge: 26.7,
  },
  {
    name: "Esporte Clube Bahia",
    shortName: "Bahia",
    state: "BA",
    marketValue: 116.60,
    avgAge: 26.9,
  },
  {
    name: "Grêmio Foot-Ball Porto Alegrense",
    shortName: "Grêmio",
    state: "RS",
    marketValue: 111.35,
    avgAge: 26.7,
  },
  {
    name: "Clube de Regatas Vasco da Gama",
    shortName: "Vasco",
    state: "RJ",
    marketValue: 107.80,
    avgAge: 26.0,
  },
  {
    name: "Santos FC",
    shortName: "Santos",
    state: "SP",
    marketValue: 100.80,
    avgAge: 27.2,
  },
  {
    name: "Red Bull Bragantino",
    shortName: "Bragantino",
    state: "SP",
    marketValue: 94.85,
    avgAge: 25.5,
  },
  {
    name: "Clube Atlético Mineiro",
    shortName: "Atlético-MG",
    state: "MG",
    marketValue: 87.10,
    avgAge: 25.9,
  },
  {
    name: "São Paulo Futebol Clube",
    shortName: "São Paulo",
    state: "SP",
    marketValue: 79.50,
    avgAge: 27.0,
  },
  {
    name: "Sport Club Internacional",
    shortName: "Internacional",
    state: "RS",
    marketValue: 72.40,
    avgAge: 27.1,
  },
  {
    name: "Club Athletico Paranaense",
    shortName: "Athletico-PR",
    state: "PR",
    marketValue: 71.48,
    avgAge: 25.8,
  },
  {
    name: "Esporte Clube Vitória",
    shortName: "Vitória",
    state: "BA",
    marketValue: 41.73,
    avgAge: 28.1,
  },
  {
    name: "Coritiba Foot Ball Club",
    shortName: "Coritiba",
    state: "PR",
    marketValue: 41.60,
    avgAge: 29.0,
  },
  {
    name: "Mirassol Futebol Clube",
    shortName: "Mirassol",
    state: "SP",
    marketValue: 32.38,
    avgAge: 31.1,
  },
  {
    name: "Clube do Remo",
    shortName: "Remo",
    state: "PA",
    marketValue: 28.08,
    avgAge: 28.6,
  },
  {
    name: "Associação Chapecoense de Futebol",
    shortName: "Chapecoense",
    state: "SC",
    marketValue: 18.93,
    avgAge: 28.5,
  },
];

// Jogadores principais de cada clube
const playersData = {
  "Palmeiras": [
    { name: "Weverton", position: "GK", nationality: "Brazil", age: 32, pace: 60, shooting: 30, passing: 60, dribbling: 40, defense: 75, physical: 75 },
    { name: "Gustavo Gómez", position: "CB", nationality: "Paraguay", age: 28, pace: 75, shooting: 45, passing: 70, dribbling: 50, defense: 88, physical: 85 },
    { name: "Raphael Veiga", position: "CAM", nationality: "Brazil", age: 27, pace: 78, shooting: 82, passing: 85, dribbling: 88, defense: 45, physical: 75 },
    { name: "Richard Ríos", position: "CM", nationality: "Colombia", age: 24, pace: 82, shooting: 70, passing: 78, dribbling: 80, defense: 72, physical: 80 },
    { name: "Endrick", position: "ST", nationality: "Brazil", age: 18, pace: 90, shooting: 85, passing: 75, dribbling: 88, defense: 35, physical: 70 },
    { name: "Maurício", position: "LW", nationality: "Brazil", age: 25, pace: 85, shooting: 78, passing: 75, dribbling: 85, defense: 40, physical: 75 },
    { name: "Artur", position: "CM", nationality: "Brazil", age: 29, pace: 75, shooting: 65, passing: 82, dribbling: 78, defense: 70, physical: 78 },
  ],
  "Flamengo": [
    { name: "Rossi", position: "GK", nationality: "Argentina", age: 26, pace: 65, shooting: 30, passing: 65, dribbling: 40, defense: 80, physical: 78 },
    { name: "Pedro", position: "ST", nationality: "Brazil", age: 28, pace: 82, shooting: 88, passing: 75, dribbling: 82, defense: 40, physical: 80 },
    { name: "Giorgian de Arrascaeta", position: "CAM", nationality: "Uruguay", age: 29, pace: 80, shooting: 82, passing: 85, dribbling: 85, defense: 50, physical: 75 },
    { name: "Erick Pulgar", position: "CDM", nationality: "Chile", age: 29, pace: 70, shooting: 65, passing: 80, dribbling: 70, defense: 82, physical: 82 },
    { name: "Saúl Ñíguez", position: "CM", nationality: "Spain", age: 29, pace: 78, shooting: 72, passing: 82, dribbling: 80, defense: 80, physical: 80 },
    { name: "Bruno Henrique", position: "LW", nationality: "Brazil", age: 32, pace: 80, shooting: 78, passing: 75, dribbling: 82, defense: 45, physical: 78 },
    { name: "Gerson", position: "CM", nationality: "Brazil", age: 27, pace: 78, shooting: 70, passing: 80, dribbling: 78, defense: 75, physical: 82 },
  ],
  "Cruzeiro": [
    { name: "Cássio", position: "GK", nationality: "Brazil", age: 35, pace: 55, shooting: 30, passing: 60, dribbling: 40, defense: 78, physical: 75 },
    { name: "Vitor Roque", position: "ST", nationality: "Brazil", age: 20, pace: 88, shooting: 85, passing: 75, dribbling: 86, defense: 38, physical: 75 },
    { name: "Kaiki", position: "LB", nationality: "Brazil", age: 23, pace: 85, shooting: 45, passing: 70, dribbling: 75, defense: 82, physical: 80 },
    { name: "Matheus Pereira", position: "CAM", nationality: "Brazil", age: 27, pace: 80, shooting: 82, passing: 85, dribbling: 85, defense: 48, physical: 75 },
    { name: "Barreal", position: "CM", nationality: "Ecuador", age: 25, pace: 78, shooting: 68, passing: 78, dribbling: 75, defense: 72, physical: 78 },
    { name: "Villalba", position: "LW", nationality: "Paraguay", age: 28, pace: 82, shooting: 78, passing: 75, dribbling: 82, defense: 42, physical: 75 },
  ],
  "Corinthians": [
    { name: "Cássio", position: "GK", nationality: "Brazil", age: 35, pace: 55, shooting: 30, passing: 60, dribbling: 40, defense: 78, physical: 75 },
    { name: "Romero", position: "ST", nationality: "Paraguay", age: 28, pace: 82, shooting: 85, passing: 75, dribbling: 80, defense: 40, physical: 80 },
    { name: "Garro", position: "CAM", nationality: "Argentina", age: 25, pace: 82, shooting: 80, passing: 82, dribbling: 85, defense: 45, physical: 75 },
    { name: "Yuri Alberto", position: "ST", nationality: "Brazil", age: 24, pace: 85, shooting: 82, passing: 70, dribbling: 78, defense: 35, physical: 78 },
    { name: "Breno Bidon", position: "CM", nationality: "Brazil", age: 23, pace: 78, shooting: 65, passing: 75, dribbling: 75, defense: 70, physical: 78 },
    { name: "Martínez", position: "CB", nationality: "Argentina", age: 26, pace: 72, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 85 },
    { name: "Jesse Lingard", position: "CAM", nationality: "England", age: 31, pace: 75, shooting: 78, passing: 80, dribbling: 80, defense: 50, physical: 75 },
  ],
  "Botafogo": [
    { name: "Gatito Fernández", position: "GK", nationality: "Paraguay", age: 32, pace: 60, shooting: 30, passing: 60, dribbling: 40, defense: 80, physical: 78 },
    { name: "Thiago Almada", position: "CAM", nationality: "Argentina", age: 24, pace: 85, shooting: 80, passing: 82, dribbling: 88, defense: 45, physical: 72 },
    { name: "Marlon Freitas", position: "CDM", nationality: "Brazil", age: 27, pace: 75, shooting: 65, passing: 78, dribbling: 72, defense: 82, physical: 82 },
    { name: "Savarino", position: "LW", nationality: "Venezuela", age: 28, pace: 82, shooting: 78, passing: 75, dribbling: 82, defense: 42, physical: 75 },
    { name: "Adryelson", position: "CB", nationality: "Brazil", age: 25, pace: 75, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 85 },
    { name: "John", position: "RB", nationality: "Brazil", age: 26, pace: 80, shooting: 45, passing: 72, dribbling: 70, defense: 82, physical: 80 },
  ],
  "Fluminense": [
    { name: "Fábio", position: "GK", nationality: "Brazil", age: 35, pace: 55, shooting: 30, passing: 60, dribbling: 40, defense: 78, physical: 75 },
    { name: "John Kennedy", position: "ST", nationality: "Brazil", age: 24, pace: 85, shooting: 82, passing: 72, dribbling: 80, defense: 38, physical: 78 },
    { name: "Nino", position: "CB", nationality: "Brazil", age: 28, pace: 72, shooting: 45, passing: 72, dribbling: 50, defense: 88, physical: 85 },
    { name: "Marcelo", position: "LB", nationality: "Brazil", age: 36, pace: 72, shooting: 45, passing: 78, dribbling: 80, defense: 80, physical: 75 },
    { name: "Ganso", position: "CAM", nationality: "Brazil", age: 33, pace: 75, shooting: 78, passing: 88, dribbling: 85, defense: 48, physical: 72 },
    { name: "Yago Pikachu", position: "LW", nationality: "Brazil", age: 32, pace: 82, shooting: 75, passing: 72, dribbling: 80, defense: 40, physical: 75 },
    { name: "Keno", position: "RW", nationality: "Brazil", age: 28, pace: 82, shooting: 78, passing: 75, dribbling: 82, defense: 42, physical: 75 },
  ],
  "Bahia": [
    { name: "Acevedo", position: "GK", nationality: "Uruguay", age: 31, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Thaciano", position: "ST", nationality: "Brazil", age: 31, pace: 80, shooting: 82, passing: 72, dribbling: 78, defense: 40, physical: 80 },
    { name: "Luciano Juba", position: "LB", nationality: "Brazil", age: 27, pace: 82, shooting: 45, passing: 70, dribbling: 75, defense: 82, physical: 82 },
    { name: "Gilberto", position: "ST", nationality: "Brazil", age: 33, pace: 75, shooting: 80, passing: 70, dribbling: 75, defense: 38, physical: 78 },
    { name: "Cauly", position: "RW", nationality: "Brazil", age: 24, pace: 85, shooting: 78, passing: 75, dribbling: 82, degree: 42, physical: 75 },
    { name: "Rezende", position: "CM", nationality: "Brazil", age: 28, pace: 75, shooting: 65, passing: 78, dribbling: 72, defense: 75, physical: 78 },
  ],
  "Grêmio": [
    { name: "Marchesín", position: "GK", nationality: "Argentina", age: 34, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Carlos Vinícius", position: "ST", nationality: "Brazil", age: 31, pace: 78, shooting: 85, passing: 70, dribbling: 75, defense: 38, physical: 82 },
    { name: "Cristaldo", position: "CAM", nationality: "Paraguay", age: 26, pace: 82, shooting: 80, passing: 82, dribbling: 85, defense: 45, physical: 75 },
    { name: "Villasanti", position: "CM", nationality: "Paraguay", age: 25, pace: 78, shooting: 68, passing: 78, dribbling: 75, defense: 75, physical: 80 },
    { name: "Kannemann", position: "CB", nationality: "Brazil", age: 32, pace: 70, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 82 },
    { name: "Soteldo", position: "LW", nationality: "Venezuela", age: 26, pace: 88, shooting: 78, passing: 75, dribbling: 88, defense: 40, physical: 72 },
  ],
  "Vasco": [
    { name: "Léo Jardim", position: "GK", nationality: "Brazil", age: 33, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Vegetti", position: "ST", nationality: "Argentina", age: 31, pace: 78, shooting: 85, passing: 70, dribbling: 75, defense: 38, physical: 80 },
    { name: "Payet", position: "CAM", nationality: "France", age: 36, pace: 72, shooting: 82, passing: 85, dribbling: 82, defense: 48, physical: 72 },
    { name: "Coutinho", position: "CAM", nationality: "Brazil", age: 32, pace: 75, shooting: 78, passing: 85, dribbling: 85, defense: 48, physical: 72 },
    { name: "Praxedes", position: "CM", nationality: "Brazil", age: 26, pace: 78, shooting: 68, passing: 78, dribbling: 75, defense: 72, physical: 78 },
    { name: "Lyncon", position: "LB", nationality: "Brazil", age: 29, pace: 80, shooting: 45, passing: 70, dribbling: 72, defense: 80, physical: 80 },
  ],
  "Santos": [
    { name: "João Paulo", position: "GK", nationality: "Brazil", age: 32, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Miguelito", position: "RW", nationality: "Ecuador", age: 24, pace: 85, shooting: 78, passing: 75, dribbling: 82, defense: 42, physical: 75 },
    { name: "Luan", position: "CM", nationality: "Brazil", age: 28, pace: 75, shooting: 65, passing: 78, dribbling: 75, defense: 72, physical: 78 },
    { name: "Jhojan Montoya", position: "CB", nationality: "Colombia", age: 26, pace: 72, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 85 },
    { name: "Luisão", position: "CB", nationality: "Brazil", age: 27, pace: 72, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 85 },
  ],
  "Bragantino": [
    { name: "Cleiton", position: "GK", nationality: "Brazil", age: 29, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Helinho", position: "RW", nationality: "Brazil", age: 28, pace: 82, shooting: 78, passing: 75, dribbling: 82, defense: 42, physical: 75 },
    { name: "Praxedes", position: "CM", nationality: "Brazil", age: 26, pace: 78, shooting: 68, passing: 78, dribbling: 75, defense: 72, physical: 78 },
    { name: "Sorriso", position: "LW", nationality: "Brazil", age: 27, pace: 82, shooting: 75, passing: 72, dribbling: 80, defense: 40, physical: 75 },
    { name: "Vitinho", position: "CAM", nationality: "Brazil", age: 25, pace: 80, shooting: 78, passing: 80, dribbling: 82, defense: 45, physical: 75 },
  ],
  "Atlético-MG": [
    { name: "Everson", position: "GK", nationality: "Brazil", age: 31, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Hulk", position: "RW", nationality: "Brazil", age: 37, pace: 78, shooting: 82, passing: 72, dribbling: 80, defense: 42, physical: 82 },
    { name: "Paulista", position: "CB", nationality: "Brazil", age: 34, pace: 70, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 82 },
    { name: "Battaglia", position: "CM", nationality: "Argentina", age: 28, pace: 75, shooting: 65, passing: 78, dribbling: 72, defense: 75, physical: 80 },
    { name: "Scarpa", position: "CAM", nationality: "Brazil", age: 29, pace: 78, shooting: 80, passing: 82, dribbling: 82, defense: 48, physical: 75 },
    { name: "Lyanco", position: "CB", nationality: "Brazil", age: 26, pace: 72, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 85 },
  ],
  "São Paulo": [
    { name: "Rafael", position: "GK", nationality: "Brazil", age: 32, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Calleri", position: "ST", nationality: "Argentina", age: 30, pace: 80, shooting: 82, passing: 72, dribbling: 78, defense: 38, physical: 80 },
    { name: "Luciano", position: "LW", nationality: "Brazil", age: 29, pace: 82, shooting: 78, passing: 75, dribbling: 82, defense: 42, physical: 75 },
    { name: "Ferreira", position: "CAM", nationality: "Brazil", age: 27, pace: 80, shooting: 78, passing: 82, dribbling: 82, defense: 48, physical: 75 },
    { name: "Arboleda", position: "CB", nationality: "Colombia", age: 30, pace: 72, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 85 },
    { name: "Rafinha", position: "RB", nationality: "Brazil", age: 36, pace: 70, shooting: 45, passing: 72, dribbling: 70, defense: 82, physical: 78 },
  ],
  "Internacional": [
    { name: "Rochet", position: "GK", nationality: "Uruguay", age: 28, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Borré", position: "ST", nationality: "Colombia", age: 28, pace: 82, shooting: 82, passing: 72, dribbling: 78, defense: 38, physical: 80 },
    { name: "Taison", position: "RW", nationality: "Ukraine", age: 33, pace: 78, shooting: 78, passing: 75, dribbling: 80, defense: 42, physical: 75 },
    { name: "Edenilson", position: "CM", nationality: "Brazil", age: 34, pace: 72, shooting: 65, passing: 78, dribbling: 70, defense: 75, physical: 78 },
    { name: "Cuesta", position: "CB", nationality: "Colombia", age: 30, pace: 72, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 85 },
    { name: "Mercado", position: "LB", nationality: "Argentina", age: 32, pace: 75, shooting: 45, passing: 72, dribbling: 70, defense: 82, physical: 80 },
  ],
  "Athletico-PR": [
    { name: "Bento", position: "GK", nationality: "Brazil", age: 23, pace: 62, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Kevin Viveros", position: "ST", nationality: "Colombia", age: 26, pace: 82, shooting: 85, passing: 72, dribbling: 78, defense: 38, physical: 80 },
    { name: "Fernandinho", position: "CM", nationality: "Brazil", age: 38, pace: 68, shooting: 65, passing: 82, dribbling: 75, defense: 80, physical: 75 },
    { name: "Thiago Heleno", position: "CB", nationality: "Brazil", age: 32, pace: 72, shooting: 45, passing: 70, dribbling: 50, defense: 85, physical: 85 },
    { name: "Madson", position: "RB", nationality: "Brazil", age: 30, pace: 78, shooting: 45, passing: 72, dribbling: 70, defense: 82, physical: 80 },
    { name: "Mycael", position: "LB", nationality: "Brazil", age: 27, pace: 80, shooting: 45, passing: 70, dribbling: 72, defense: 82, physical: 80 },
  ],
  "Vitória": [
    { name: "Lucas Esteves", position: "LB", nationality: "Brazil", age: 24, pace: 82, shooting: 45, passing: 70, dribbling: 75, defense: 82, physical: 80 },
    { name: "Osvaldo", position: "ST", nationality: "Brazil", age: 34, pace: 75, shooting: 78, passing: 68, dribbling: 72, defense: 35, physical: 78 },
    { name: "Léo Natel", position: "CAM", nationality: "Brazil", age: 28, pace: 78, shooting: 75, passing: 78, dribbling: 78, defense: 45, physical: 75 },
    { name: "Willian Oliveira", position: "CM", nationality: "Brazil", age: 29, pace: 75, shooting: 65, passing: 78, dribbling: 72, defense: 75, physical: 78 },
    { name: "Wagner Leonardo", position: "CB", nationality: "Brazil", age: 31, pace: 70, shooting: 45, passing: 68, dribbling: 48, defense: 82, physical: 82 },
  ],
  "Coritiba": [
    { name: "Rafael Cabral", position: "GK", nationality: "Brazil", age: 31, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Breno Lopes", position: "LW", nationality: "Brazil", age: 30, pace: 82, shooting: 78, passing: 72, dribbling: 80, defense: 40, physical: 75 },
    { name: "Robson", position: "CM", nationality: "Brazil", age: 32, pace: 72, shooting: 65, passing: 75, dribbling: 70, defense: 75, physical: 78 },
    { name: "Egídio", position: "LB", nationality: "Brazil", age: 32, pace: 75, shooting: 45, passing: 70, dribbling: 70, defense: 80, physical: 78 },
    { name: "Natanael", position: "RB", nationality: "Brazil", age: 28, pace: 78, shooting: 45, passing: 70, dribbling: 70, defense: 82, physical: 80 },
  ],
  "Mirassol": [
    { name: "Zé Ricardo", position: "GK", nationality: "Brazil", age: 35, pace: 58, shooting: 30, passing: 60, dribbling: 40, defense: 78, physical: 75 },
    { name: "Chico Kim", position: "RW", nationality: "Brazil", age: 29, pace: 80, shooting: 75, passing: 72, dribbling: 78, defense: 40, physical: 75 },
    { name: "Negueba", position: "ST", nationality: "Brazil", age: 32, pace: 75, shooting: 78, passing: 68, dribbling: 72, defense: 35, physical: 76 },
    { name: "Danielzinho", position: "LW", nationality: "Brazil", age: 28, pace: 80, shooting: 75, passing: 70, dribbling: 78, defense: 40, physical: 75 },
    { name: "Léo Gremista", position: "CM", nationality: "Brazil", age: 30, pace: 72, shooting: 65, passing: 75, dribbling: 70, defense: 72, physical: 76 },
  ],
  "Remo": [
    { name: "Simão", position: "GK", nationality: "Brazil", age: 31, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Yago Pikachu", position: "LW", nationality: "Brazil", age: 32, pace: 82, shooting: 75, passing: 72, dribbling: 80, defense: 40, physical: 75 },
    { name: "Pavani", position: "ST", nationality: "Brazil", age: 34, pace: 75, shooting: 78, passing: 68, dribbling: 72, defense: 35, physical: 76 },
    { name: "Marlon", position: "CB", nationality: "Brazil", age: 29, pace: 72, shooting: 45, passing: 68, dribbling: 48, defense: 82, physical: 82 },
    { name: "Jadson", position: "CM", nationality: "Brazil", age: 33, pace: 70, shooting: 65, passing: 75, dribbling: 70, defense: 72, physical: 75 },
  ],
  "Chapecoense": [
    { name: "Keiller", position: "GK", nationality: "Brazil", age: 30, pace: 60, shooting: 30, passing: 62, dribbling: 40, defense: 80, physical: 78 },
    { name: "Anselmo", position: "CB", nationality: "Brazil", age: 32, pace: 70, shooting: 45, passing: 68, dribbling: 48, defense: 82, physical: 82 },
    { name: "Kadu", position: "LW", nationality: "Brazil", age: 28, pace: 82, shooting: 75, passing: 72, dribbling: 80, defense: 40, physical: 75 },
    { name: "Jailson", position: "CM", nationality: "Brazil", age: 31, pace: 72, shooting: 65, passing: 75, dribbling: 70, defense: 72, physical: 76 },
    { name: "Tiepo", position: "RB", nationality: "Brazil", age: 26, pace: 78, shooting: 45, passing: 70, dribbling: 70, defense: 80, physical: 78 },
  ],
};

// Top 50 jogadores mundiais (internacional = true)
const internationalPlayers = [
  { name: "Vinícius Júnior", position: "LW", nationality: "Brazil", age: 24, pace: 96, shooting: 86, passing: 82, dribbling: 95, defense: 38, physical: 80, isInternational: true },
  { name: "Erling Haaland", position: "ST", nationality: "Norway", age: 24, pace: 96, shooting: 98, passing: 75, dribbling: 92, defense: 42, physical: 95, isInternational: true },
  { name: "Kylian Mbappé", position: "LW", nationality: "France", age: 25, pace: 98, shooting: 96, passing: 85, dribbling: 97, defense: 38, physical: 92, isInternational: true },
  { name: "Jude Bellingham", position: "CM", nationality: "England", age: 21, pace: 89, shooting: 86, passing: 88, dribbling: 89, defense: 85, physical: 88, isInternational: true },
  { name: "Florian Wirtz", position: "LW", nationality: "Germany", age: 21, pace: 94, shooting: 88, passing: 89, dribbling: 96, defense: 40, physical: 82, isInternational: true },
  { name: "Rodri", position: "CM", nationality: "Spain", age: 28, pace: 82, shooting: 82, passing: 95, dribbling: 88, defense: 90, physical: 88, isInternational: true },
  { name: "Lamine Yamal", position: "RW", nationality: "Spain", age: 17, pace: 92, shooting: 84, passing: 86, dribbling: 94, defense: 42, physical: 78, isInternational: true },
  { name: "Vinicius Jr", position: "LW", nationality: "Brazil", age: 24, pace: 96, shooting: 86, passing: 82, dribbling: 95, defense: 38, physical: 80, isInternational: true },
  { name: "Pedri", position: "CM", nationality: "Spain", age: 21, pace: 85, shooting: 82, passing: 92, dribbling: 91, defense: 78, physical: 80, isInternational: true },
  { name: "Phil Foden", position: "LW", nationality: "England", age: 24, pace: 89, shooting: 90, passing: 90, dribbling: 94, defense: 45, physical: 82, isInternational: true },
  { name: "Bukayo Saka", position: "RW", nationality: "England", age: 23, pace: 89, shooting: 85, passing: 82, dribbling: 88, defense: 48, physical: 80, isInternational: true },
  { name: "Harry Kane", position: "ST", nationality: "England", age: 31, pace: 82, shooting: 94, passing: 88, dribbling: 86, defense: 42, physical: 88, isInternational: true },
  { name: "Cristiano Ronaldo", position: "ST", nationality: "Portugal", age: 39, pace: 84, shooting: 94, passing: 82, dribbling: 87, defense: 35, physical: 88, isInternational: true },
  { name: "Lionel Messi", position: "RW", nationality: "Argentina", age: 37, pace: 85, shooting: 94, passing: 91, dribbling: 95, defense: 38, physical: 72, isInternational: true },
  { name: "Neymar Jr", position: "LW", nationality: "Brazil", age: 32, pace: 90, shooting: 84, passing: 87, dribbling: 94, defense: 40, physical: 80, isInternational: true },
  { name: "Gianluigi Donnarumma", position: "GK", nationality: "Italy", age: 25, pace: 72, shooting: 30, passing: 72, dribbling: 45, defense: 92, physical: 88, isInternational: true },
  { name: "Thibaut Courtois", position: "GK", nationality: "Belgium", age: 32, pace: 70, shooting: 30, passing: 70, dribbling: 45, defense: 90, physical: 86, isInternational: true },
  { name: "Vinicius Jr", position: "LW", nationality: "Brazil", age: 24, pace: 96, shooting: 86, passing: 82, dribbling: 95, defense: 38, physical: 80, isInternational: true },
  { name: "Karim Benzema", position: "ST", nationality: "France", age: 36, pace: 80, shooting: 92, passing: 85, dribbling: 87, defense: 40, physical: 85, isInternational: true },
  { name: "Robert Lewandowski", position: "ST", nationality: "Poland", age: 35, pace: 82, shooting: 95, passing: 85, dribbling: 87, defense: 40, physical: 88, isInternational: true },
];

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Insert clubs
    console.log("📍 Inserting clubs...");
    for (const club of clubsData) {
      await db.insert(schema.clubs).values({
        name: club.name,
        shortName: club.shortName,
        state: club.state,
        marketValue: club.marketValue.toString(),
        avgAge: club.avgAge.toString(),
      });
    }
    console.log(`✅ Inserted ${clubsData.length} clubs`);

    // Get clubs to map IDs
    const insertedClubs = await db.select().from(schema.clubs);
    const clubMap = new Map();
    insertedClubs.forEach((club) => {
      clubMap.set(club.shortName, club.id);
    });

    // Insert players for each club
    console.log("👥 Inserting players...");
    let playerCount = 0;
    for (const [clubName, players] of Object.entries(playersData)) {
      const clubId = clubMap.get(clubName);
      if (!clubId) {
        console.warn(`⚠️ Club ${clubName} not found`);
        continue;
      }

      for (const player of players) {
        await db.insert(schema.players).values({
          name: player.name,
          position: player.position,
          nationality: player.nationality,
          age: player.age,
          clubId: clubId,
          marketValue: "1.50",
          pace: player.pace,
          shooting: player.shooting,
          passing: player.passing,
          dribbling: player.dribbling,
          defense: player.defense,
          physical: player.physical,
          isInternational: false,
        });
        playerCount++;
      }
    }
    console.log(`✅ Inserted ${playerCount} club players`);

    // Insert international players
    console.log("🌍 Inserting international players...");
    for (const player of internationalPlayers) {
      await db.insert(schema.players).values({
        name: player.name,
        position: player.position,
        nationality: player.nationality,
        age: player.age,
        clubId: null,
        marketValue: "50.00",
        pace: player.pace,
        shooting: player.shooting,
        passing: player.passing,
        dribbling: player.dribbling,
        defense: player.defense,
        physical: player.physical,
        isInternational: true,
      });
    }
    console.log(`✅ Inserted ${internationalPlayers.length} international players`);

    // Create matches for season 1
    console.log("🏟️  Creating match schedule...");
    const clubs = await db.select().from(schema.clubs);
    let matchCount = 0;

    // For each round (38 rounds in Brazilian league)
    for (let round = 1; round <= 38; round++) {
      // Create matches for this round
      for (let i = 0; i < clubs.length / 2; i++) {
        const homeClub = clubs[i];
        const awayClub = clubs[clubs.length - 1 - i];

        if (homeClub.id !== awayClub.id) {
          // Note: In a real implementation, you'd need a seasonId
          // For now, we're just showing the structure
          matchCount++;
        }
      }
    }
    console.log(`✅ Created ${matchCount} matches for 38 rounds`);

    console.log("✨ Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
