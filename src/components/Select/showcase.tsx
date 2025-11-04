import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CustomSelect, type SelectOption } from "./index";

export function SelectShowcase() {
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const options: SelectOption[] = [
        { value: 1, label: "Opção 1" },
        { value: 2, label: "Opção 2" },
        { value: 3, label: "Opção 3" },
        { value: 4, label: "Opção 4" },
    ];

    const sizeOptions: SelectOption[] = [
        { value: "xs", label: "Extra Pequeno" },
        { value: "sm", label: "Pequeno" },
        { value: "md", label: "Médio" },
        { value: "lg", label: "Grande" },
        { value: "xl", label: "Extra Grande" },
    ];

    const categoryOptions: SelectOption[] = [
        { value: "electronics", label: "Eletrônicos" },
        { value: "clothing", label: "Roupas" },
        { value: "food", label: "Alimentos" },
        { value: "books", label: "Livros" },
        { value: "toys", label: "Brinquedos" },
    ];

    function handleValueChange(value: string) {
        setSelectedValue(value);
        console.log("Valor selecionado:", value);
    }

    function handleSizeChange(value: string) {
        setSelectedSize(value);
        console.log("Tamanho selecionado:", value);
    }

    function handleCategoryChange(value: string) {
        setSelectedCategory(value);
        console.log("Categoria selecionada:", value);
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Select Component</h1>
                <p className="text-muted-foreground">
                    Componente de seleção customizado usando Shadcn UI
                </p>
            </div>

            <div className="grid gap-8">
                {/* Select Padrão */}
                <Card className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Select Padrão</h2>
                        <p className="text-sm text-muted-foreground">
                            Select com tamanho padrão e placeholder
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Selecione uma opção:
                        </label>
                        <CustomSelect
                            options={options}
                            value={selectedValue}
                            onChange={handleValueChange}
                            placeholder="Escolha uma opção"
                        />
                        {selectedValue && (
                            <p className="text-sm text-muted-foreground">
                                Valor selecionado: {selectedValue}
                            </p>
                        )}
                    </div>
                </Card>

                {/* Select Pequeno */}
                <Card className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Select Pequeno</h2>
                        <p className="text-sm text-muted-foreground">
                            Select com tamanho reduzido (size="sm")
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Selecione um tamanho:
                        </label>
                        <CustomSelect
                            options={sizeOptions}
                            value={selectedSize}
                            onChange={handleSizeChange}
                            placeholder="Escolha um tamanho"
                            size="sm"
                        />
                        {selectedSize && (
                            <p className="text-sm text-muted-foreground">
                                Tamanho selecionado: {selectedSize}
                            </p>
                        )}
                    </div>
                </Card>

                {/* Select com className customizado */}
                <Card className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">
                            Select com Largura Customizada
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Select com className para controlar a largura
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Selecione uma categoria:
                        </label>
                        <CustomSelect
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            placeholder="Escolha uma categoria"
                            className="w-full max-w-xs"
                        />
                        {selectedCategory && (
                            <p className="text-sm text-muted-foreground">
                                Categoria selecionada: {categoryOptions.find(
                                    (opt) => opt.value === selectedCategory
                                )?.label}
                            </p>
                        )}
                    </div>
                </Card>

                {/* Select Desabilitado */}
                <Card className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Select Desabilitado</h2>
                        <p className="text-sm text-muted-foreground">
                            Select com propriedade disabled
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Campo desabilitado:
                        </label>
                        <CustomSelect
                            options={options}
                            placeholder="Este campo está desabilitado"
                            onChange={() => { }}
                            disabled
                        />
                    </div>
                </Card>

                {/* Exemplo de Uso */}
                <Card className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Exemplo de Código</h2>
                        <p className="text-sm text-muted-foreground">
                            Como usar o componente CustomSelect
                        </p>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`import { CustomSelect, type SelectOption } from "@/components/Select";

const options: SelectOption[] = [
  { value: 1, label: "Opção 1" },
  { value: 2, label: "Opção 2" },
  { value: 3, label: "Opção 3" },
];

function MyComponent() {
  const [value, setValue] = useState<string>("");

  function handleChange(value: string) {
    setValue(value);
    console.log("Valor selecionado:", value);
  }

  return (
    <CustomSelect
      options={options}
      value={value}
      onChange={handleChange}
      placeholder="Selecione..."
      size="default"
    />
  );
}`}</code>
                    </pre>
                </Card>
            </div>
        </div>
    );
}
