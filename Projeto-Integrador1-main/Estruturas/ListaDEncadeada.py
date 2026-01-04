class No:
    def __init__(self, valor):
        self.valor = valor
        self.anterior = None
        self.proximo = None

class ListaDuplamenteEncadeada:
    def __init__(self):
        self.cabeca = None

    def inserir_inicio(self, valor):
        novo_no = No(valor)
        if self.cabeca is None:
            self.cabeca = novo_no
        else:
            novo_no.proximo = self.cabeca
            self.cabeca.anterior = novo_no
            self.cabeca = novo_no

    def inserir_fim(self, valor):
        novo_no = No(valor)
        if self.cabeca is None:
            self.cabeca = novo_no
        else:
            temp = self.cabeca
            while temp.proximo is not None:
                temp = temp.proximo
            temp.proximo = novo_no
            novo_no.anterior = temp

    def remover(self, valor):
        temp = self.cabeca
        while temp is not None:
            if temp.valor == valor:
                if temp == self.cabeca:
                    self.cabeca = temp.proximo
                    if self.cabeca is not None:
                        self.cabeca.anterior = None
                else:
                    if temp.proximo is not None:
                        temp.proximo.anterior = temp.anterior
                    if temp.anterior is not None:
                        temp.anterior.proximo = temp.proximo
                return
            temp = temp.proximo
        print("Valor não encontrado.")

    def exibir(self):
        temp = self.cabeca
        while temp is not None:
            print(temp.valor, end=" <-> ")
            temp = temp.proximo
        print("None")

    def exibir_inverso(self):
        temp = self.cabeca
        if temp is None:
            return
        while temp.proximo is not None:
            temp = temp.proximo
        while temp is not None:
            print(temp.valor, end=" <-> ")
            temp = temp.anterior
        print("None")
    
    def to_list(self):
        result = []
        current = self.cabeca
        while current:
            result.append(current.valor.__dict__)
            current = current.proximo
        return result