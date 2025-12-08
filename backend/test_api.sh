#!/bin/bash

BASE_URL="http://localhost:5000/api"
EMAIL="testuser_$(date +%s)@example.com"
PASSWORD="password123"
USERNAME="testuser_$(date +%s)"

echo "--- 1. Inscription ---"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
echo "Response: $SIGNUP_RESPONSE"
echo ""

echo "--- 2. Connexion ---"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
echo "Response: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "Token: $TOKEN"
echo ""

if [ -z "$TOKEN" ]; then
  echo "Erreur: Impossible de récupérer le token. Arrêt du test."
  exit 1
fi

echo "--- 3. Créer un article ---"
ARTICLE_RESPONSE=$(curl -s -X POST "$BASE_URL/articles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Mon premier article", "content": "Ceci est le contenu de mon article."}')
echo "Response: $ARTICLE_RESPONSE"
ARTICLE_ID=$(echo $ARTICLE_RESPONSE | grep -o '"_id":"[^"]*' | grep -o '[^"]*$')
echo "Article ID: $ARTICLE_ID"
echo ""

echo "--- 4. Récupérer tous les articles ---"
curl -s -X GET "$BASE_URL/articles"
echo ""
echo ""

echo "--- 5. Ajouter un commentaire ---"
COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/comments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"content\": \"Super article !\", \"articleId\": \"$ARTICLE_ID\"}")
echo "Response: $COMMENT_RESPONSE"
COMMENT_ID=$(echo $COMMENT_RESPONSE | grep -o '"_id":"[^"]*' | grep -o '[^"]*$')
echo "Comment ID: $COMMENT_ID"
echo ""

echo "--- 6. Récupérer les commentaires de l'article ---"
curl -s -X GET "$BASE_URL/comments/article/$ARTICLE_ID"
echo ""
echo ""

echo "--- 7. Supprimer le commentaire ---"
curl -s -X DELETE "$BASE_URL/comments/$COMMENT_ID" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo "--- 8. Supprimer l'article ---"
curl -s -X DELETE "$BASE_URL/articles/$ARTICLE_ID" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo "--- 9. Déconnexion ---"
curl -s -X POST "$BASE_URL/auth/logout"
echo ""
echo ""

echo "--- Test terminé ---"

