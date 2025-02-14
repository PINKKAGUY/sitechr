<?php
require 'vendor/autoload.php';

use Google\Cloud\RecaptchaEnterprise\V1\RecaptchaEnterpriseServiceClient;
use Google\Cloud\RecaptchaEnterprise\V1\Event;
use Google\Cloud\RecaptchaEnterprise\V1\Assessment;
use Google\Cloud\RecaptchaEnterprise\V1\TokenProperties\InvalidReason;

function validate_recaptcha(
  string $recaptchaKey,
  string $token,
  string $project,
  string $action
): bool {
  $client = new RecaptchaEnterpriseServiceClient();
  $projectName = $client->projectName($project);

  // Préparer l'événement
  $event = (new Event())
    ->setSiteKey($recaptchaKey)
    ->setToken($token);

  // Préparer la demande d'évaluation
  $assessment = (new Assessment())
    ->setEvent($event);

  try {
    // Appeler l'API pour créer une évaluation
    $response = $client->createAssessment(
      $projectName,
      $assessment
    );

    // Vérifier la validité du jeton
    if ($response->getTokenProperties()->getValid() == false) {
      error_log('Jeton invalide pour la raison suivante: ' .
        InvalidReason::name($response->getTokenProperties()->getInvalidReason()));
      return false;
    }

    // Vérifier si l'action correspond
    if ($response->getTokenProperties()->getAction() !== $action) {
      error_log('Action non valide pour ce jeton.');
      return false;
    }

    // Analyser le score de risque
    $score = $response->getRiskAnalysis()->getScore();
    if ($score < 0.5) {
      error_log('Score trop bas: ' . $score);
      return false;
    }

    return true;

  } catch (Exception $e) {
    error_log('Erreur lors de l\'appel à createAssessment: ' . $e->getMessage());
    return false;
  }
}

// Récupérer les données du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $recaptchaToken = $_POST['g-recaptcha-response'] ?? '';
  $firstName = htmlspecialchars(trim($_POST['first-name']));
  $lastName = htmlspecialchars(trim($_POST['last-name']));
  $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
  $phone = htmlspecialchars(trim($_POST['phone']));
  $message = htmlspecialchars(trim($_POST['message']));

  if (!$recaptchaToken) {
    http_response_code(400);
    echo 'Erreur: le jeton reCAPTCHA est manquant.';
    exit;
  }

  // Valider le reCAPTCHA
  $isValid = validate_recaptcha(
    '6LeCt4gqAAAAAP9--Lg7jdi2MIlEtLojY2NpEDiK',
    $recaptchaToken,
    'latransmuteuse-1732464487160',
    'submit'
  );

  if (!$isValid) {
    http_response_code(400);
    echo 'Erreur: validation reCAPTCHA échouée.';
    exit;
  }

  // Gérer les données après validation
  $to = 'contact@latransmuteuse.vision';
  $subject = 'Nouvelle soumission du formulaire';
  $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

  $body = "Prénom: $firstName\nNom: $lastName\nEmail: $email\nTéléphone: $phone\nMessage:\n$message";

  if (mail($to, $subject, $body, $headers)) {
    echo 'Merci pour votre soumission. Nous vous contacterons bientôt.';
  } else {
    http_response_code(500);
    echo 'Erreur lors de l\'envoi de l\'email.';
  }
}
?>
