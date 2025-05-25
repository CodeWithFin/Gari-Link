import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  Share,
  Linking
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES } from '../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ServiceDetailsScreen = ({ route, navigation }) => {
  const { recordId } = route.params || {};
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serviceRecord, setServiceRecord] = useState(null);
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    if (recordId) {
      loadServiceRecord();
    } else {
      setLoading(false);
    }
  }, [recordId]);

  const loadServiceRecord = async () => {
    try {
      const response = await authAxios.get(`/maintenance/record/${recordId}`);
      const record = response.data.data.maintenanceRecord;
      setServiceRecord(record);
      
      // Load vehicle data
      if (record.vehicleId) {
        const vehicleRes = await authAxios.get(`/vehicles/${record.vehicleId}`);
        setVehicle(vehicleRes.data.data.vehicle);
      }
    } catch (error) {
      console.error('Error loading service record:', error);
      Alert.alert(
        'Error',
        'Failed to load service record details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'oil_change':
        return <Icon name="oil" size={30} color={COLORS.primary} />;
      case 'tire_rotation':
        return <Icon name="tire" size={30} color={COLORS.primary} />;
      case 'brake_service':
        return <Icon name="car-brake-abs" size={30} color={COLORS.primary} />;
      case 'inspection':
        return <Icon name="magnify" size={30} color={COLORS.primary} />;
      case 'repair':
        return <Icon name="wrench" size={30} color={COLORS.primary} />;
      default:
        return <Icon name="tools" size={30} color={COLORS.primary} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewReceipt = (receiptUrl) => {
    // In a real app, this would open the receipt image or PDF
    Linking.openURL(receiptUrl).catch(() => {
      Alert.alert('Error', 'Could not open receipt. The URL may be invalid.');
    });
  };

  const handleEditRecord = () => {
    navigation.navigate('EditService', { 
      recordId: serviceRecord._id,
      vehicleId: serviceRecord.vehicleId
    });
  };

  const handleDeleteRecord = () => {
    Alert.alert(
      'Delete Service Record',
      'Are you sure you want to delete this service record? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await authAxios.delete(`/maintenance/record/${recordId}`);
              Alert.alert(
                'Success',
                'Service record deleted successfully',
                [
                  { 
                    text: 'OK', 
                    onPress: () => navigation.goBack() 
                  }
                ]
              );
            } catch (error) {
              console.error('Error deleting service record:', error);
              Alert.alert('Error', 'Failed to delete service record');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleShareRecord = async () => {
    if (!serviceRecord) return;
    
    try {
      const vehicleInfo = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle';
      const dateStr = formatDate(serviceRecord.date);
      const message = `${serviceRecord.title} for ${vehicleInfo}\nDate: ${dateStr}\nMileage: ${serviceRecord.mileage} miles\nCost: $${serviceRecord.cost?.amount || '0'}\n\nShared from GariLink`;
      
      await Share.share({
        message,
        title: 'Service Record'
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share service record');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading service details...</Text>
      </View>
    );
  }

  if (!serviceRecord) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="file-alert" size={80} color={COLORS.gray} />
          <Text style={styles.errorTitle}>Record Not Found</Text>
          <Text style={styles.errorText}>
            We couldn't find this service record. It may have been deleted or you may not have permission to view it.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <TouchableOpacity onPress={handleShareRecord}>
          <Icon name="share-variant" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceIconContainer}>
            {getServiceIcon(serviceRecord.type)}
          </View>
          <View style={styles.serviceTitleContainer}>
            <Text style={styles.serviceTitle}>{serviceRecord.title}</Text>
            <Text style={styles.serviceDate}>{formatDate(serviceRecord.date)}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vehicle:</Text>
            <Text style={styles.detailValue}>
              {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.nickname ? ` (${vehicle.nickname})` : ''}` : 'Unknown Vehicle'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Odometer:</Text>
            <Text style={styles.detailValue}>{serviceRecord.mileage.toLocaleString()} miles</Text>
          </View>

          {serviceRecord.cost && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service Cost:</Text>
              <Text style={styles.detailValue}>${serviceRecord.cost.amount.toFixed(2)} {serviceRecord.cost.currency}</Text>
            </View>
          )}

          {serviceRecord.serviceProvider && serviceRecord.serviceProvider.name && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service Provider:</Text>
              <Text style={styles.detailValue}>{serviceRecord.serviceProvider.name}</Text>
            </View>
          )}

          {serviceRecord.serviceProvider && serviceRecord.serviceProvider.address && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Provider Address:</Text>
              <Text style={styles.detailValue}>{serviceRecord.serviceProvider.address}</Text>
            </View>
          )}

          {serviceRecord.serviceProvider && serviceRecord.serviceProvider.phone && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Provider Phone:</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${serviceRecord.serviceProvider.phone}`)}
              >
                <Text style={[styles.detailValue, styles.phoneLink]}>
                  {serviceRecord.serviceProvider.phone}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {serviceRecord.description && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Service Notes</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{serviceRecord.description}</Text>
            </View>
          </View>
        )}

        {serviceRecord.receipts && serviceRecord.receipts.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Receipts & Documents</Text>
            <View style={styles.receiptsContainer}>
              {serviceRecord.receipts.map((receipt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.receiptItem}
                  onPress={() => handleViewReceipt(receipt.url)}
                >
                  <Icon 
                    name={receipt.fileType === 'pdf' ? 'file-pdf-box' : 'file-image'} 
                    size={30} 
                    color={COLORS.primary} 
                  />
                  <View style={styles.receiptInfo}>
                    <Text style={styles.receiptName}>
                      {receipt.name || `Receipt ${index + 1}`}
                    </Text>
                    <Text style={styles.receiptDate}>
                      {new Date(receipt.uploadDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={COLORS.gray} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {serviceRecord.partsReplaced && serviceRecord.partsReplaced.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Parts Replaced</Text>
            <View style={styles.partsContainer}>
              {serviceRecord.partsReplaced.map((part, index) => (
                <View key={index} style={styles.partItem}>
                  <Icon name="car-cog" size={20} color={COLORS.primary} />
                  <Text style={styles.partName}>{part.name}</Text>
                  {part.partNumber && (
                    <Text style={styles.partNumber}>Part #: {part.partNumber}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {serviceRecord.obdData && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>OBD Diagnostics</Text>
            <View style={styles.obdContainer}>
              {serviceRecord.obdData.dtcCodes && serviceRecord.obdData.dtcCodes.length > 0 ? (
                <View>
                  <Text style={styles.obdSubtitle}>Diagnostic Trouble Codes:</Text>
                  {serviceRecord.obdData.dtcCodes.map((code, index) => (
                    <View key={index} style={styles.dtcItem}>
                      <Text style={styles.dtcCode}>{code.code}</Text>
                      <Text style={styles.dtcDescription}>{code.description}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.healthStatusContainer}>
                  <Icon name="check-circle" size={40} color={COLORS.success} />
                  <Text style={styles.healthStatusText}>No issues detected</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {serviceRecord.nextServiceDue && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Next Service Due</Text>
            <View style={styles.nextServiceContainer}>
              {serviceRecord.nextServiceDue.dueMileage && (
                <View style={styles.nextServiceItem}>
                  <Icon name="speedometer" size={20} color={COLORS.primary} />
                  <Text style={styles.nextServiceText}>
                    At {serviceRecord.nextServiceDue.dueMileage.toLocaleString()} miles
                  </Text>
                </View>
              )}
              {serviceRecord.nextServiceDue.dueDate && (
                <View style={styles.nextServiceItem}>
                  <Icon name="calendar" size={20} color={COLORS.primary} />
                  <Text style={styles.nextServiceText}>
                    On {new Date(serviceRecord.nextServiceDue.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleEditRecord}
          >
            <Icon name="pencil" size={18} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Edit Record</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteRecord}
          >
            <Icon name="delete" size={18} color={COLORS.danger} />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  backButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    borderRadius: 30,
    marginRight: 15,
  },
  serviceTitleContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  serviceDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  detailsContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  detailLabel: {
    width: 130,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
  },
  phoneLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  sectionContainer: {
    marginTop: 15,
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.grayLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 15,
  },
  notesContainer: {
    padding: 15,
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 16,
    color: COLORS.dark,
    lineHeight: 22,
  },
  receiptsContainer: {
    marginBottom: 10,
  },
  receiptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
    marginBottom: 10,
  },
  receiptInfo: {
    flex: 1,
    marginLeft: 15,
  },
  receiptName: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '500',
    marginBottom: 3,
  },
  receiptDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  partsContainer: {
    marginBottom: 10,
  },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
    marginBottom: 10,
  },
  partName: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '500',
    marginLeft: 15,
    flex: 1,
  },
  partNumber: {
    fontSize: 14,
    color: COLORS.gray,
  },
  obdContainer: {
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
    padding: 15,
  },
  obdSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 10,
  },
  dtcItem: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    padding: 10,
    marginBottom: 8,
  },
  dtcCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: 5,
  },
  dtcDescription: {
    fontSize: 14,
    color: COLORS.dark,
  },
  healthStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  healthStatusText: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '500',
    marginLeft: 10,
  },
  nextServiceContainer: {
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
    padding: 15,
  },
  nextServiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nextServiceText: {
    fontSize: 16,
    color: COLORS.dark,
    marginLeft: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  deleteButton: {
    borderColor: COLORS.danger,
  },
  deleteButtonText: {
    color: COLORS.danger,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  errorButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceDetailsScreen;
