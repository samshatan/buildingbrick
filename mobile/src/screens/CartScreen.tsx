import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

export default function CartScreen({ navigation }: any) {
  // Dummy cart data - to be replaced with real global state/API later
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Premium Cement Bag', price: 15.99, quantity: 2, image: '🏗️' },
    { id: '2', name: 'Standard Paint Gallon', price: 25.50, quantity: 1, image: '🎨' },
    { id: '3', name: 'Safety Helmet', price: 12.00, quantity: 1, image: '🪖' },
  ]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigation.navigate('Payment', { amount: total, items: cartItems });
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <View style={styles.imageBox}>
        <Text style={styles.imageEmoji}>{item.image}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityControl}>
          <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Review Your Order</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>Your cart is empty.</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.shopBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Fee</Text>
              <Text style={styles.totalValue}>$0.00</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Total Amount</Text>
              <Text style={styles.grandTotalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  listContainer: {
    padding: SPACING.lg,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  imageBox: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  imageEmoji: {
    fontSize: 30,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.accent,
    marginBottom: 8,
  },
  quantityControl: {
    backgroundColor: COLORS.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  removeBtn: {
    padding: 8,
  },
  removeText: {
    color: COLORS.textLight,
    fontSize: 18,
  },
  footer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    ...SHADOWS.lg,
  },
  summaryBox: {
    marginBottom: SPACING.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  checkoutBtnText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  shopBtnText: {
    color: COLORS.surface,
    fontWeight: '700',
  },
});
