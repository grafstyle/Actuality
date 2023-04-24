export class Tools {
  public convIfUndefined(textOrUndefined: string | undefined): string {
    if (textOrUndefined == undefined) return '';
    return textOrUndefined;
  }

  public createURLName(name: string): string {
    return name.replace(' ', '_').toLowerCase();
  }
}
