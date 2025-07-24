// Scoring system removed - focusing on manual candidate evaluation
export const formatSalary = (salaryStr: string) => {
  return salaryStr.replace(/\$(\d+)/, (match, number) => {
    const num = parseInt(number);
    return num >= 1000 ? `$${(num / 1000).toFixed(0)}k` : match;
  });
};