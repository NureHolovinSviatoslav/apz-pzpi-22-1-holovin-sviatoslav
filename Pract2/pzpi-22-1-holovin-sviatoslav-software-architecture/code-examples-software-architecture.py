class Subject:
    def __init__(self):
        self._observers = []
        self._state = None

    def attach(self, observer):
        self._observers.append(observer)

    def detach(self, observer):
        self._observers.remove(observer)

    def notify(self):
        for observer in self._observers:
            observer.update(self._state)

    def set_state(self, state):
        self._state = state
        self.notify()

class Observer:
    def update(self, state):
        pass

class ConcreteObserver(Observer):
    def update(self, state):
        print(f"Спостерігач отримав новий стан: {state}")

# Використання паттерну
subject = Subject()
observer1 = ConcreteObserver()
observer2 = ConcreteObserver()

subject.attach(observer1)
subject.attach(observer2)
subject.set_state("Активний")
