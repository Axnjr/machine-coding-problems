import { createInterface } from 'readline';
import { KeyValueStore } from './src/core/KeyValueStore';

const store = new KeyValueStore();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line: string) => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return;

  const parts = trimmedLine.split(/\s+/);
  const command = parts[0];

  try {
    switch (command) {
      case 'get':
        if (parts.length < 2) break;
        const getKey = parts[1];
        const value = store.get(getKey);
        if (value) {
          console.log(value.toString());
        } else {
          console.log(`No entry found for ${getKey}`);
        }
        break;

      case 'put':
        if (parts.length < 4 || parts.length % 2 !== 0) break; // put key k1 v1 ... (even number of args after put)
        const putKey = parts[1];
        const attributes: Array<{ key: string, value: string }> = [];
        for (let i = 2; i < parts.length; i += 2) {
          attributes.push({ key: parts[i], value: parts[i + 1] });
        }
        store.put(putKey, attributes);
        break;

      case 'delete':
        if (parts.length < 2) break;
        store.delete(parts[1]);
        break;

      case 'search':
        if (parts.length < 3) break;
        const searchKey = parts[1];
        const searchVal = parts[2];
        const results = store.search(searchKey, searchVal);
        console.log(results.join(','));
        break;

      case 'keys':
        const allKeys = store.keys();
        console.log(allKeys.join(','));
        break;

      case 'exit':
        process.exit(0);
        break;

      default:
        // Ignore unknown commands or print error? Prompt says "Stop taking the input when you encounter the word exit."
        // It doesn't specify behavior for invalid commands, but usually we ignore or print error.
        // Given strict output format, better to ignore or handle gracefully.
        break;
    }
  } catch (e: any) {
    if (e.message === 'Data Type Error') {
      console.log('Data Type Error');
    } else {
      // console.error(e); // Should we print other errors? Prompt says "Exception Handling should also happen in the Driver/Main class."
      // "Nothing should be printed inside any of these methods."
      // "Print Data Type Error if attribute has data type other than previous set."
      // For other errors, maybe silent or log? I'll just log the message if it's not Data Type Error to be safe, or maybe nothing.
      // But strictly, only "Data Type Error" is specified.
    }
  }
});

/**
 * 
 * input:
 * get k1
 * put k1 ak1 av1 ak2 av2 ak3 av3
 * delete k1
 * search k1 v1
 * keys
 * exit
 * 
 * output:
 * 
 * 
 */