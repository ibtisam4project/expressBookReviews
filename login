COMMAND:
curl -c cookies.txt -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d "{\"username\":\"john_doe\",\"password\":\"password123\"}"

OUTPUT:
Customer successfully logged in
