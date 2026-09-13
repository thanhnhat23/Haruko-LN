package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type JWTConfig struct{
	Secert string
	Access time.Duration
	Refesh time.Duration
}

type DBConfig struct{
	Host string
	Port string
	User string
	Name string
	Password string
}
type Config struct{
	Port string
	DB DBConfig
	JWT JWTConfig
}
func getENV(key,defaultValue string) string{
	value  := os.Getenv(key)
	if value!=""{
		return  value
	}
	return defaultValue
	
}
func getMustENV(key string) string{
	value   :=  os.Getenv(key);
	if (value==""){
		log.Fatalf("Khong co bien moi truong %q", key)
	}
	return value
}
func getIntENV(key string, defaultValue int) int{
	value := os.Getenv(key);
	if value   ==  ""{
		return defaultValue
	}
	v,err := strconv.Atoi(value)
	if (err!=nil){
		log.Fatalf("Loi doc bien moi truong %q", key)
	}
	return v
}
func getDurationENV(key string, defaultValue time.Duration) time.Duration{
	if value  := os.Getenv(key); value == ""{
		return defaultValue
	} else{
		v, err  := time.ParseDuration(value);
		if err!=nil {
			return defaultValue;
		}
		return v;
	}
}
func Load() *Config{
	if err := godotenv.Load(); err!=nil {
		log.Fatalf("Can't read .env")
	}
	return &Config{
		Port: getENV("PORT", "8080"),
		DB: DBConfig{
			Host: getENV("DB_HOST","localhost"),
			Port: getENV("DB_PORT","3306"),
			User: getMustENV("DB_USER"),
			Name: getMustENV("DB_NAME"),
			Password: getMustENV("DB_PASSWORD"),
		},
		JWT: JWTConfig{
			Secert: getMustENV("JWT_SECERT"),
			Access: getDurationENV("JWT_ACCESS",15*time.Minute),
			Refesh: getDurationENV("JWT_REFESH",168*time.Hour),
		},
	}
}
func (d DBConfig) DSN() string {
	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		d.User, d.Password, d.Host, d.Port, d.Name,
	)
}