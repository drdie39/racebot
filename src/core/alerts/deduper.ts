export class AlertDeduper {
  private active = new Set<string>();

  shouldEmit(key: string, isActive: boolean): boolean {
    if (!isActive) {
      this.active.delete(key);
      return false;
    }
    if (this.active.has(key)) return false;
    this.active.add(key);
    return true;
  }
}
