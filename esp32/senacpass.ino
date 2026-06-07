/*
 * ================================================================
 * ESTRUTURA BASE IoT — ESP32-C3 + MFRC522 (RFID) + API REST
 * SENAC — Disciplina: IoT Aplicado | Versão 5.0 (RFID + HC-SR04 + Buzzer)
 * ================================================================
 *
 * GUIA DE LIGAÇÃO (PINOUT)
 * ---------------------------------------------------------------
 *
 * RFID RC522
 * -------------------------------
 * 3.3V  -> 3V3 +
 * GND   -> GND -
 * RST   -> GPIO 2
 * SDA   -> GPIO 10
 * MOSI  -> GPIO 8
 * MISO  -> GPIO 7
 * SCK   -> GPIO 6
 *
 * LED
 * -------------------------------
 * Negativo
 * R -> GPIO 0
 * G -> GPIO 9
 * B -> GPIO 1
 *
 * BUZZER
 * -------------------------------
 * + -> GPIO 3
 * - -> GND
 *
 * HC-SR04
 * -------------------------------
 * VCC  -> 3V3
 * GND  -> GND
 * TRIG -> GPIO 4
 * ECHO -> GPIO 5
 *
 * ================================================================
 *
 * BLOCO 1 — BIBLIOTECAS E DEPENDÊNCIAS
 * ================================================================
 */

#include <WiFi.h>         // Gerencia WiFi do ESP32
#include <HTTPClient.h>   // Permite requisições HTTP
#include <SPI.h>          // Comunicação SPI
#include <MFRC522.h>      // Controle do RFID
#include <ArduinoJson.h>  // Manipulação de JSON
#include <Arduino.h>
#include "secrets.h"      // Credenciais e identificadores locais

/*
 * ================================================================
 * BLOCO 2 — PARÂMETROS DO ALUNO E VARIÁVEIS GLOBAIS
 * ================================================================
 */

// ================================================================
// 1. PARÂMETROS DE CONFIGURAÇÃO
// ================================================================

// ── Identificação ─────────────────────────────────────────────

// ── Credenciais WiFi ──────────────────────────────────────────

// ── API ────────────────────────────────────────────────────────

// Os valores desta seção ficam no arquivo local secrets.h.

// ── Hardware e Pinos ──────────────────────────────────────────

constexpr uint8_t PINO_RST = 2;
constexpr uint8_t PINO_SS = 10;

constexpr uint8_t PINO_LED_R = 0;
constexpr uint8_t PINO_LED_G = 9;
constexpr uint8_t PINO_LED_B = 1;

constexpr uint8_t PINO_BUZZER = 3;

constexpr uint8_t PINO_TRIG = 4;
constexpr uint8_t PINO_ECHO = 5;

// ── Lógica do Sistema ─────────────────────────────────────────

const unsigned long INTERVALO_LEITURA_MS = 3000;
const unsigned long INTERVALO_MEDICAO_MS = 100;
const float DISTANCIA_APROXIMACAO_CM = 15.0;

// ================================================================
// 2. VARIÁVEIS DE ESTADO
// ================================================================

unsigned long tempoUltimaLeitura = 0;
unsigned long tempoUltimaMedicao = 0;

bool pessoaProxima = false;
bool leituraRfidLiberada = false;
float ultimaDistanciaCM = 0;

unsigned long ultimaTentativaWiFi = 0;

const unsigned long INTERVALO_RECONEXAO_WIFI = 10000;  // 10 segundos

// Instancia o objeto RFID

MFRC522 leitorRfid(PINO_SS, PINO_RST);

/*
 * ================================================================
 * BLOCO 3 — PROTÓTIPOS DE FUNÇÕES
 * ================================================================
 */

void conectarWiFi();
void verificarWiFi();

void inicializarRfid();

bool novoCartaoPresente();
String lerUidDoCartao();

void piscarLEDSucesso();
void piscarLEDErro();

void ledVerde();
void ledVermelho();
void ledAzul();
void ledApagar();

void ledBranco();
void ledAmarelo();
void ledCiano();

void tocarBuzzerCurto();
void tocarBuzzerSucesso();
void tocarBuzzerErro();
void tocarBuzzerLeitura();
void tocarBuzzerAPI_OK();
void tocarBuzzerAPI_ERRO();

float medirDistanciaCM();

void feedbackLeituraCartao();
void feedbackAPI_OK();
void feedbackAPI_ERRO();
void feedbackWiFiConectado();
void feedbackWiFiReconectando();

bool enviarParaAPI(String uidCartao);

/*
 * ================================================================
 * BLOCO 4 — SETUP
 * ================================================================
 */

void setup() {

  Serial.begin(115200);

  while (!Serial) {
    delay(10);
  }

  Serial.println("\n================================================");
  Serial.println(" Sistema IoT SENACPASS v1.0 — Iniciando...");
  Serial.println("================================================");

  // ==============================================================
  // Configuração dos pinos
  // ==============================================================

  pinMode(PINO_LED_R, OUTPUT);
  pinMode(PINO_LED_G, OUTPUT);
  pinMode(PINO_LED_B, OUTPUT);

  ledApagar();

  ledVermelho();
  ledAzul();
  ledVerde();

  pinMode(PINO_BUZZER, OUTPUT);
  digitalWrite(PINO_BUZZER, LOW);

  pinMode(PINO_TRIG, OUTPUT);
  pinMode(PINO_ECHO, INPUT);

  Serial.println("[OK] Pinos configurados.");

  // ==============================================================
  // Inicialização RFID
  // ==============================================================

  inicializarRfid();

  // ==============================================================
  // Conexão WiFi
  // ==============================================================

  conectarWiFi();

  // ==============================================================
  // Feedback inicial
  // ==============================================================

  feedbackLeituraCartao();

  Serial.println("[OK] Sistema pronto.");
  Serial.println("[OK] Aguardando aproximação...");
  Serial.println();
}

/*
 * ================================================================
 * BLOCO 5 — LOOP PRINCIPAL
 * ================================================================
 */

void loop() {

  // ==============================================================
  // Passo 1: Verificar conexão WiFi
  // ==============================================================

  verificarWiFi();

  static bool wifiJaConectado = false;

  if (WiFi.status() == WL_CONNECTED && !wifiJaConectado) {

    wifiJaConectado = true;

    Serial.println("[WiFi] Reconectado com sucesso!");
    Serial.print("[WiFi] IP local: ");
    Serial.println(WiFi.localIP());
  }

  if (WiFi.status() != WL_CONNECTED) {

    wifiJaConectado = false;
  }

  unsigned long agora = millis();

  // ==============================================================
  // Passo 2: Medir distância
  // ==============================================================

  if (agora - tempoUltimaMedicao >= INTERVALO_MEDICAO_MS) {

    tempoUltimaMedicao = agora;
    ultimaDistanciaCM = medirDistanciaCM();

    // Serial.print("[HC-SR04] Distância: ");
    // Serial.print(ultimaDistanciaCM);
    // Serial.println(" cm");

    // ==============================================================
    // Passo 3: Detectar aproximação
    // ==============================================================

    bool aproximacaoAtual =
      (ultimaDistanciaCM > 0 &&
       ultimaDistanciaCM < DISTANCIA_APROXIMACAO_CM);

    // ==========================================================
    // Detecta mudança de estado
    // ==========================================================

    if (aproximacaoAtual != pessoaProxima) {

      pessoaProxima = aproximacaoAtual;

      // ======================================================
      // Pessoa acabou de aproximar
      // ======================================================

      if (pessoaProxima) {

        Serial.println("[HC-SR04] Pessoa aproximou.");

        leituraRfidLiberada = true;
        ledAzul();
      }

      // ======================================================
      // Pessoa acabou de se afastar
      // ======================================================

      else {

        Serial.println("[HC-SR04] Área livre.");

        leituraRfidLiberada = false;
        ledApagar();
      }
    }
  }

  // ==============================================================
  // Passo 4: Controle de cooldown RFID
  // ==============================================================

  bool cooldownConcluido =
    (tempoUltimaLeitura == 0 ||
     agora - tempoUltimaLeitura >= INTERVALO_LEITURA_MS);

  if (pessoaProxima && leituraRfidLiberada && cooldownConcluido) {

    // ============================================================
    // Passo 5: Verifica cartão RFID
    // ============================================================

    if (novoCartaoPresente()) {

      String uid = lerUidDoCartao();

      if (uid != "") {

        tempoUltimaLeitura = agora;

        // Uma leitura válida desarma o RFID até a pessoa se afastar
        // e provocar uma nova mudança para "pessoa aproximou".
        leituraRfidLiberada = false;

        Serial.println("\n--- Nova Leitura RFID Detectada ---");
        Serial.println("[RFID] Cartão lido: " + uid);

        // ========================================================
        // Feedback visual e sonoro
        // ========================================================

        piscarLEDSucesso();
        tocarBuzzerSucesso();

        // ========================================================
        // Envio para API
        // ========================================================

        if (WiFi.status() == WL_CONNECTED) {

          ledAmarelo();
          bool enviado = enviarParaAPI(uid);

          if (enviado) {

            Serial.println("[OK] Dados enviados para API.");

            feedbackAPI_OK();

          } else {

            Serial.println("[ERRO] Falha ao enviar para API.");

            feedbackAPI_ERRO();
          }

        } else {

          Serial.println("[AVISO] Sem internet.");

          feedbackAPI_ERRO();
        }
      }
    }
  }
}

/*
 * ================================================================
 * BLOCO 6 — FUNÇÕES DE INTERNET (WIFI)
 * ================================================================
 */

void conectarWiFi() {

  Serial.print("[WiFi] Conectando à rede: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);

  WiFi.setSleep(false);

  WiFi.disconnect(true);

  delay(1000);

  ledBranco();

  WiFi.begin(WIFI_SSID, WIFI_SENHA);

  int tentativas = 0;

  while (WiFi.status() != WL_CONNECTED && tentativas < 30) {

    delay(500);

    Serial.print(".");

    tentativas++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println("[WiFi] Conectado com sucesso!");
    Serial.print("[WiFi] IP do ESP32: ");
    Serial.println(WiFi.localIP());

    feedbackWiFiConectado();

  } else {

    Serial.println("[WiFi] Falha na conexão.");
  }
}

void verificarWiFi() {

  // Já conectado
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  unsigned long agora = millis();

  // Evita flood de reconexão
  if (agora - ultimaTentativaWiFi < INTERVALO_RECONEXAO_WIFI) {
    return;
  }

  ultimaTentativaWiFi = agora;

  Serial.println("[WiFi] Tentando reconectar...");

  feedbackWiFiReconectando();

  // NÃO usar disconnect(true)
  WiFi.reconnect();
}

/*
 * ================================================================
 * BLOCO 7 — RFID
 * ================================================================
 */

void inicializarRfid() {

  // SPI customizado:
  // SCK, MISO, MOSI, SS
  SPI.begin(6, 7, 8, 10);

  leitorRfid.PCD_Init();

  delay(50);

  uint8_t versaoChip =
    leitorRfid.PCD_ReadRegister(MFRC522::VersionReg);

  if (versaoChip == 0x00 || versaoChip == 0xFF) {

    Serial.println("[RFID] ERRO FATAL: RFID não detectado!");
    Serial.println("[RFID] Verifique SDA, MOSI, MISO, SCK e RST.");

    while (true) {

      tocarBuzzerErro();
      delay(1000);
    }

  } else {

    Serial.printf(
      "[RFID] Módulo OK! Versão: 0x%02X\n",
      versaoChip);
  }
}

bool novoCartaoPresente() {

  if (!leitorRfid.PICC_IsNewCardPresent()) {
    return false;
  }

  Serial.println("[DEBUG] Cartao detectado");

  if (!leitorRfid.PICC_ReadCardSerial()) {
    Serial.println("[DEBUG] Falha ao ler serial");
    return false;
  }

  Serial.println("[DEBUG] UID lido");

  return true;
}

String lerUidDoCartao() {

  String uidFormatado = "";

  for (byte i = 0; i < leitorRfid.uid.size; i++) {

    if (leitorRfid.uid.uidByte[i] < 0x10) {

      uidFormatado += "0";
    }

    uidFormatado += String(leitorRfid.uid.uidByte[i], HEX);
  }

  uidFormatado.toUpperCase();

  leitorRfid.PICC_HaltA();
  leitorRfid.PCD_StopCrypto1();

  return uidFormatado;
}

/*
 * ================================================================
 * BLOCO 8 — HC-SR04
 * ================================================================
 */

float medirDistanciaCM() {

  digitalWrite(PINO_TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(PINO_TRIG, HIGH);
  delayMicroseconds(10);

  digitalWrite(PINO_TRIG, LOW);

  long duracao = pulseIn(PINO_ECHO, HIGH, 30000);

  if (duracao == 0) {
    return 0;
  }

  float distancia = duracao * 0.034 / 2.0;

  return distancia;
}

/*
 * ================================================================
 * BLOCO 9 — LED E BUZZER
 * ================================================================
 */

void piscarLEDSucesso() {

  ledVerde();
  delay(200);

  ledApagar();
  delay(100);

  ledVerde();
  delay(200);

  ledApagar();
}

void piscarLEDErro() {

  for (int i = 0; i < 3; i++) {

    ledVermelho();
    delay(100);

    ledApagar();
    delay(100);
  }
}

void ledApagar() {
  digitalWrite(PINO_LED_R, LOW);
  digitalWrite(PINO_LED_G, LOW);
  digitalWrite(PINO_LED_B, LOW);
}

void ledVerde() {

  ledApagar();
  digitalWrite(PINO_LED_G, HIGH);
}

void ledVermelho() {

  ledApagar();
  digitalWrite(PINO_LED_R, HIGH);
}

void ledAzul() {

  ledApagar();
  digitalWrite(PINO_LED_B, HIGH);
}

void ledBranco() {

  ledApagar();

  digitalWrite(PINO_LED_R, HIGH);
  digitalWrite(PINO_LED_G, HIGH);
  digitalWrite(PINO_LED_B, HIGH);
}

void ledAmarelo() {

  ledApagar();

  digitalWrite(PINO_LED_R, HIGH);
  digitalWrite(PINO_LED_G, HIGH);
}

void ledCiano() {

  ledApagar();

  digitalWrite(PINO_LED_G, HIGH);
  digitalWrite(PINO_LED_B, HIGH);
}

void tocarBuzzerCurto() {

  digitalWrite(PINO_BUZZER, HIGH);
  delay(80);

  digitalWrite(PINO_BUZZER, LOW);
}

void tocarBuzzerSucesso() {

  for (int i = 0; i < 2; i++) {

    digitalWrite(PINO_BUZZER, HIGH);
    delay(120);

    digitalWrite(PINO_BUZZER, LOW);
    delay(100);
  }
}

void tocarBuzzerLeitura() {

  digitalWrite(PINO_BUZZER, HIGH);
  delay(70);

  digitalWrite(PINO_BUZZER, LOW);
}

void tocarBuzzerAPI_OK() {

  for (int i = 0; i < 3; i++) {

    digitalWrite(PINO_BUZZER, HIGH);
    delay(60);

    digitalWrite(PINO_BUZZER, LOW);
    delay(60);
  }
}

void tocarBuzzerAPI_ERRO() {

  for (int i = 0; i < 2; i++) {

    digitalWrite(PINO_BUZZER, HIGH);
    delay(400);

    digitalWrite(PINO_BUZZER, LOW);
    delay(150);
  }
}

void feedbackLeituraCartao() {

  ledCiano();

  tocarBuzzerLeitura();

  delay(150);

  if (pessoaProxima)
    ledAzul();
  else
    ledApagar();
}

void feedbackAPI_OK() {

  for (int i = 0; i < 3; i++) {

    ledVerde();

    digitalWrite(PINO_BUZZER, HIGH);
    delay(70);

    digitalWrite(PINO_BUZZER, LOW);
    delay(70);

    ledApagar();
    delay(70);
  }

  ledApagar();
}

void feedbackAPI_ERRO() {

  for (int i = 0; i < 4; i++) {

    ledVermelho();
    delay(120);

    ledApagar();
    delay(120);
  }

  tocarBuzzerAPI_ERRO();

  ledVermelho();
  delay(500);

  ledBranco();
}

void feedbackWiFiConectado() {

  ledBranco();

  digitalWrite(PINO_BUZZER, HIGH);
  delay(100);

  digitalWrite(PINO_BUZZER, LOW);
}

void feedbackWiFiReconectando() {

  ledAmarelo();

  digitalWrite(PINO_BUZZER, HIGH);
  delay(50);

  digitalWrite(PINO_BUZZER, LOW);
}

void tocarBuzzerErro() {

  digitalWrite(PINO_BUZZER, HIGH);
  delay(500);

  digitalWrite(PINO_BUZZER, LOW);
}

/*
 * ================================================================
 * BLOCO 10 — ENVIO PARA API
 * ================================================================
 */

bool enviarParaAPI(String uidCartao) {

  // ==============================================================
  // Criação do JSON
  // ==============================================================

  StaticJsonDocument<192> doc;

  doc["rfid_uid"] = uidCartao;

  // A API espera o UUID da tabela dispositivo. Deixe vazio para
  // omitir o campo enquanto o UUID real não estiver configurado.
  if (strlen(ID_DISPOSITIVO) > 0) {
    doc["id_dispositivo"] = ID_DISPOSITIVO;
  }

  String pacoteJSON;

  serializeJson(doc, pacoteJSON);

  Serial.println("[API] Enviando pacote:");
  Serial.println(pacoteJSON);

  // ==============================================================
  // Requisição HTTP
  // ==============================================================

  HTTPClient http;

  http.setTimeout(8000);

  http.begin(API_URL);

  http.addHeader("Content-Type", "application/json");

  // A rota POST /api/presencas é pública no backend atual.

  int codigoRespostaHTTP = http.POST(pacoteJSON);

  bool sucesso = false;

  // ==============================================================
  // Tratamento da resposta
  // ==============================================================

  if (codigoRespostaHTTP > 0) {

    Serial.printf("[API] HTTP %d\n", codigoRespostaHTTP);

    String respostaServidor = http.getString();

    if (respostaServidor.length() > 0) {
      Serial.println("[API] Resposta:");
      Serial.println(respostaServidor);
    }

    if (codigoRespostaHTTP == HTTP_CODE_OK ||
        codigoRespostaHTTP == HTTP_CODE_CREATED) {

      sucesso = true;

    } else if (codigoRespostaHTTP == 400) {

      Serial.println("[API] Erro 400: leitura rejeitada pela regra de negócio.");

    } else if (codigoRespostaHTTP == 401) {

      Serial.println("[API] Erro 401: Não autorizado.");

    } else {

      Serial.println("[API] Erro HTTP não tratado.");
    }

  } else {

    Serial.printf(
      "[API] Falha de conexão: %s\n",
      http.errorToString(codigoRespostaHTTP).c_str());
  }

  // ==============================================================
  // Liberação de memória
  // ==============================================================

  http.end();

  return sucesso;
}
