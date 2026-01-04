class No:
    def __init__(self, valor):
        self.valor = valor
        self.esquerda = None
        self.direita = None

class ArvoreBinaria:
    def __init__(self):
        self.raiz = None

    def inserir(self, valor):
        if self.raiz is None:
            self.raiz = No(valor)
        else:
            self._inserir(self.raiz, valor)

    def _inserir(self, no_atual, valor):
        if valor < no_atual.valor:
            if no_atual.esquerda is None:
                no_atual.esquerda = No(valor)
            else:
                self._inserir(no_atual.esquerda, valor)
        else:
            if no_atual.direita is None:
                no_atual.direita = No(valor)
            else:
                self._inserir(no_atual.direita, valor)

    def em_ordem(self):
        self._em_ordem(self.raiz)

    def _em_ordem(self, no_atual):
        if no_atual is not None:
            self._em_ordem(no_atual.esquerda)
            print(no_atual.valor, end=' ')
            self._em_ordem(no_atual.direita)

    def pre_ordem(self):
        self._pre_ordem(self.raiz)

    def _pre_ordem(self, no_atual):
        if no_atual is not None:
            print(no_atual.valor, end=' ')
            self._pre_ordem(no_atual.esquerda)
            self._pre_ordem(no_atual.direita)

    def pos_ordem(self):
        self._pos_ordem(self.raiz)

    def _pos_ordem(self, no_atual):
        if no_atual is not None:
            self._pos_ordem(no_atual.esquerda)
            self._pos_ordem(no_atual.direita)
            print(no_atual.valor, end=' ')

    def to_list(self):
        """Converte a árvore binária em uma lista de dicionários"""
        return self._to_list_recursivo(self.raiz)

    def _to_list_recursivo(self, no_atual):
        if no_atual is None:
            return []
        
        resultado = []
        resultado.append(no_atual.valor.__dict__)
        resultado += self._to_list_recursivo(no_atual.esquerda)  
        resultado += self._to_list_recursivo(no_atual.direita) 
            
        return resultado
    
    