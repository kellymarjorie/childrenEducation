const int FIRST_TRIG = 7;
const int FIRST_ECHO = 6;
const int SECOND_TRIG = 3;
const int SECOND_ECHO = 2;

int first_distance;
int second_distance;
int duration;

void setup() {
  pinMode(FIRST_TRIG, OUTPUT);
  pinMode(FIRST_ECHO, INPUT);

  pinMode(SECOND_TRIG, OUTPUT);
  pinMode(SECOND_ECHO, INPUT);
  
  Serial.begin(115200);
}

void loop() {
  digitalWrite(FIRST_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(FIRST_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(FIRST_TRIG, LOW);

  duration = pulseIn(FIRST_ECHO, HIGH);
  first_distance = duration / 29 / 2;

  digitalWrite(SECOND_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(SECOND_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(SECOND_TRIG, LOW);

  duration = pulseIn(SECOND_ECHO, HIGH);
  second_distance = duration / 29 / 2;

  delay(10);
  Serial.println("First sonar: " + (String)first_distance);
  Serial.println("Second sonar: " + (String)second_distance);
}
