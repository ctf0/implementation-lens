import * as vscode from 'vscode';
import * as utils from '../utils';

export default class CodeLens implements vscode.CodeLensProvider {
    async provideCodeLenses(doc: vscode.TextDocument): Promise<vscode.CodeLens[]> {
        const links: any = [];

        if (doc !== undefined) {
            const skipLanguages: string[] = utils.config.skipLanguages;

            if (skipLanguages.length) {
                if (skipLanguages.includes(doc.languageId)) {
                    return [];
                }
            }

            const symbols: vscode.DocumentSymbol[] | undefined = await getFileSymbols(doc.uri);

            if (symbols && symbols.length) {
                const _interface: vscode.DocumentSymbol | undefined = symbols.find((symbol: vscode.DocumentSymbol) => symbol.kind == vscode.SymbolKind.Interface);

                if (_interface) {
                    links.push(await getCodeLens(doc, _interface));

                    const _methods = _interface.children.filter((symbol: vscode.DocumentSymbol) => symbol.kind == vscode.SymbolKind.Method);

                    for (const _method of _methods) {
                        links.push(await getCodeLens(doc, _method));
                    }
                }
            }
        }

        return links.filter((e) => e);
    }
}

export async function getFileSymbols(uri: vscode.Uri): Promise<any> {
    return vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri);
}

async function getCodeLens(doc: vscode.TextDocument, item: vscode.DocumentSymbol): Promise<vscode.CodeLens | undefined> {
    const implementations: vscode.LocationLink[] = await vscode.commands.executeCommand(
        'vscode.executeImplementationProvider',
        doc.uri,
        item.selectionRange.start,
    );

    if (implementations.length) {
        return new vscode.CodeLens(item.selectionRange, {
            command   : 'editor.action.showReferences',
            title     : `${implementations.length} implementation(s)`,
            arguments : [
                doc.uri,
                item.selectionRange.start,
                // @ts-ignore
                implementations.map((item) => new vscode.Location(item.targetUri, item.targetSelectionRange)),
            ],
        });
    }
}
