function formatDateToTimeBucket(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")

  console.log(`Formatting date ${date} to time bucket ${year}${month}${day}${hours}0000`)

  // For simplicity, we set minutes and seconds to 0000
  return `${year}${month}${day}${hours}0000`
}

console.log(formatDateToTimeBucket(new Date("2025-03-01T00:00:00Z")))
